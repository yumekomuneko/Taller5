import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Payment, PaymentMethod, PaymentStatus } from './entities/payment.entity';
import { OrderService } from '../order/order.service';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrderStatus } from '../order/entities/order.entity';

// Mocks de dependencias
const mockPaymentRepository = {
    save: jest.fn(),
    update: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
};

const mockOrderService = {
    findOne: jest.fn(),
    updateStatus: jest.fn(),
};

const mockConfigService = {
    get: jest.fn((key: string) => {
        if (key === 'STRIPE_SECRET_KEY') return 'test_secret_key';
        if (key === 'STRIPE_WEBHOOK_SECRET') return 'test_webhook_secret';
        if (key === 'FRONTEND_URL') return 'http://localhost:4200';
    }),
};

// Mocks de Stripe (Simular la respuesta de la API externa)
const mockStripe = {
    checkout: {
        sessions: {
            create: jest.fn(),
            retrieve: jest.fn(),
        },
    },
    webhooks: {
        constructEvent: jest.fn(),
    }
};

// Aseguramos que el constructor de Stripe use nuestro mock
jest.mock('stripe', () => {
    return jest.fn(() => mockStripe);
});


describe('PaymentService', () => {
    let service: PaymentService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PaymentService,
                { provide: getRepositoryToken(Payment), useValue: mockPaymentRepository },
                { provide: OrderService, useValue: mockOrderService },
                { provide: ConfigService, useValue: mockConfigService },
            ],
        }).compile();

        service = module.get<PaymentService>(PaymentService);

        // Limpiar mocks antes de cada prueba
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    // ==========================================
    // MOCK DE DATOS COMUNES
    // ==========================================

    const mockOrder = { 
        id: 1, 
        total: 150.00, 
        user: { id: 101, email: 'test@mail.com' } 
    };

    const mockCreatePaymentDto = { 
        userId: 101, 
        orderId: 1,
        // Se agrega 'method' por si el DTO lo requiere para pasar la validación
        method: PaymentMethod.STRIPE 
    };
    describe('createStripeCheckout', () => {

        it('should throw NotFoundException if order does not exist', async () => {
            mockOrderService.findOne.mockResolvedValue(null);
            
            await expect(service.createStripeCheckout(mockCreatePaymentDto as any))
                .rejects
                .toThrow(NotFoundException);
        });

        it('should throw BadRequestException if order total is invalid', async () => {
            mockOrderService.findOne.mockResolvedValue({ 
                id: 1, 
                total: 0, // Total inválido
                user: { id: 101, email: 'test@mail.com' } 
            });
            
            await expect(service.createStripeCheckout(mockCreatePaymentDto as any))
                .rejects
                .toThrow(BadRequestException);
            expect(mockOrderService.findOne).toHaveBeenCalledWith(1);
        });

        it('should throw BadRequestException if order belongs to a different user', async () => {
            mockOrderService.findOne.mockResolvedValue({ 
                id: 1, 
                total: 150.00, 
                user: { id: 999, email: 'other@mail.com' } // Usuario incorrecto
            });
            
            await expect(service.createStripeCheckout(mockCreatePaymentDto as any))
                .rejects
                .toThrow(BadRequestException);
        });
        
        it('should successfully create a Stripe session and return the URL', async () => {
            // Setup Mocks
            mockOrderService.findOne.mockResolvedValue(mockOrder);
            mockPaymentRepository.save.mockResolvedValue({ id: 5, ...mockCreatePaymentDto, status: PaymentStatus.PENDING });
            mockStripe.checkout.sessions.create.mockResolvedValue({ 
                id: 'cs_test_123', 
                url: 'http://stripe.url/checkout' 
            });

            const result = await service.createStripeCheckout(mockCreatePaymentDto as any);

            // Debe guardar el pago en PENDING
            expect(mockPaymentRepository.save).toHaveBeenCalledWith(
                expect.objectContaining({ 
                    orderId: 1,
                    status: PaymentStatus.PENDING 
                })
            );
            expect(mockStripe.checkout.sessions.create).toHaveBeenCalled();
            expect(mockPaymentRepository.update).toHaveBeenCalledWith(5, { stripeSessionId: 'cs_test_123' });
            expect(result).toEqual({ url: 'http://stripe.url/checkout', sessionId: 'cs_test_123' });
        });
        
        it('should mark payment as CANCELLED if Stripe session creation fails', async () => {
            // Setup Mocks
            mockOrderService.findOne.mockResolvedValue(mockOrder);
            mockPaymentRepository.save.mockResolvedValue({ id: 5, ...mockCreatePaymentDto, status: PaymentStatus.PENDING });
            // Simular fallo de Stripe
            mockStripe.checkout.sessions.create.mockRejectedValue(new Error('Stripe API failed'));

            await expect(service.createStripeCheckout(mockCreatePaymentDto as any))
                .rejects
                .toThrow(BadRequestException);

            // Debe actualizar el estado a CANCELLED
            expect(mockPaymentRepository.update).toHaveBeenCalledWith(5, { status: PaymentStatus.CANCELLED });
        });
    });
    describe('verifyStripePayment', () => {
        const sessionId = 'cs_test_123';
        const mockStripeSession = (status: string, paymentStatus: string, metadata: any) => ({
            id: sessionId,
            status: status,
            payment_status: paymentStatus,
            metadata: metadata,
            payment_intent: 'pi_test_123',
        });
        
        it('should throw BadRequestException if metadata is missing', async () => {
            mockStripe.checkout.sessions.retrieve.mockResolvedValue(mockStripeSession('complete', 'paid', {}));
            
            await expect(service.verifyStripePayment(sessionId))
                .rejects
                .toThrow(BadRequestException);
        });

        it('should throw NotFoundException if local payment record is not found', async () => {
            mockStripe.checkout.sessions.retrieve.mockResolvedValue(mockStripeSession('complete', 'paid', { paymentId: '5' }));
            mockPaymentRepository.findOneBy.mockResolvedValue(null);
            
            await expect(service.verifyStripePayment(sessionId))
                .rejects
                .toThrow(NotFoundException);
        });

        it('should update status to PAID and update order status successfully', async () => {
            const paidSession = mockStripeSession('complete', 'paid', { paymentId: '5', orderId: '1' });
            mockStripe.checkout.sessions.retrieve.mockResolvedValue(paidSession);
            
            // Simular que el pago local está en PENDING
            mockPaymentRepository.findOneBy.mockResolvedValue({ id: 5, orderId: 1, status: PaymentStatus.PENDING });

            const result = await service.verifyStripePayment(sessionId);

            // Assertions
            expect(mockPaymentRepository.update).toHaveBeenCalledWith(5, { 
                status: PaymentStatus.PAID,
                stripePaymentIntentId: 'pi_test_123'
            });
            expect(mockOrderService.updateStatus).toHaveBeenCalledWith(1, OrderStatus.PAID);
            expect(result.status).toEqual(PaymentStatus.PAID);
        });

        it('should update status to FAILED and update order status to CANCELLED', async () => {
            const failedSession = mockStripeSession('expired', 'unpaid', { paymentId: '5', orderId: '1' });
            mockStripe.checkout.sessions.retrieve.mockResolvedValue(failedSession);
            
            // Simular que el pago local está en PENDING
            mockPaymentRepository.findOneBy.mockResolvedValue({ id: 5, orderId: 1, status: PaymentStatus.PENDING });

            const result = await service.verifyStripePayment(sessionId);

            // Debe actualizar el estado a FAILED y marcar la orden como CANCELLED
            expect(mockPaymentRepository.update).toHaveBeenCalledWith(5, expect.objectContaining({ 
                status: PaymentStatus.FAILED 
            }));
            expect(mockOrderService.updateStatus).toHaveBeenCalledWith(1, OrderStatus.CANCELLED);
            expect(result.status).toEqual(PaymentStatus.FAILED);
        });
    });
    describe('handleStripeWebhook', () => {
        const rawBody = Buffer.from('{"id": "evt_test"}');
        const signature = 't=123,v1=test_sig';
        
        it('should throw BadRequestException if rawBody is missing', async () => {
            await expect(service.handleStripeWebhook(undefined, signature))
                .rejects
                .toThrow(BadRequestException);
        });

        it('should throw BadRequestException if signature verification fails', async () => {
            mockStripe.webhooks.constructEvent.mockImplementation(() => {
                throw new Error('Invalid signature');
            });
            
            await expect(service.handleStripeWebhook(rawBody, signature))
                .rejects
                .toThrow(BadRequestException);
        });
        
        it('should update order status to PAID on payment_intent.succeeded', async () => {
            const successfulEvent = {
                type: 'payment_intent.succeeded',
                data: {
                    object: {
                        metadata: { orderId: '1' }
                    }
                }
            };
            mockStripe.webhooks.constructEvent.mockReturnValue(successfulEvent);

            await service.handleStripeWebhook(rawBody, signature);

            expect(mockOrderService.updateStatus).toHaveBeenCalledWith(1, OrderStatus.PAID);
        });

        it('should update order status to CANCELLED on payment_intent.payment_failed', async () => {
            const failedEvent = {
                type: 'payment_intent.payment_failed',
                data: {
                    object: {
                        metadata: { orderId: '2' }
                    }
                }
            };
            mockStripe.webhooks.constructEvent.mockReturnValue(failedEvent);

            await service.handleStripeWebhook(rawBody, signature);

            expect(mockOrderService.updateStatus).toHaveBeenCalledWith(2, OrderStatus.CANCELLED);
        });
        
        it('should ignore unhandled event types', async () => {
            const unhandledEvent = {
                type: 'customer.created',
                data: { object: {} }
            };
            mockStripe.webhooks.constructEvent.mockReturnValue(unhandledEvent);

            await service.handleStripeWebhook(rawBody, signature);

            // No debería llamar a updateStatus
            expect(mockOrderService.updateStatus).not.toHaveBeenCalled();
        });
    });
});