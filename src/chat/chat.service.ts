/*import { Injectable } from '@nestjs/common';
import { ProductService } from '../product/product.service';
import { OrderService } from '../order/order.service';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class ChatService {
    constructor(
        private productService: ProductService,
        private orderService: OrderService,
        private paymentService: PaymentService
    ) {}

    async checkProductAvailability(productQuery: string, customerId: string) {
        const product = await this.productService.findByQuery(productQuery);
    
        if (!product) {
        return {
            available: false,
            message: `No encontré el producto "${productQuery}"`
        };
        }

        const stockInfo = await this.productService.getStockInfo(product.id);
        const recommendations = await this.productService.getRecommendations(product.id, customerId);

        return {
            available: stockInfo.quantity > 0,
            product: {
                name: product.name,
                price: product.price,
                image: product.image,
                sku: product.sku
            },
            stock: stockInfo,
            message: stockInfo.quantity > 0 
                ? ` ${product.name} está disponible. Stock: ${stockInfo.quantity} unidades. Precio: $${product.price}`
                : ` ${product.name} está agotado. Te avisaremos cuando esté disponible.`,
            recommendations: recommendations.slice(0, 3)
        };
    }

    async compareProducts(productQueries: string[]) {
        const products = await Promise.all(
            productQueries.map(query => this.productService.findByQuery(query))
        );

        const validProducts = products.filter(p => p !== null);
    
        if (validProducts.length < 2) {
            return {
                success: false,
                message: 'Necesita al menos 2 productos válidos para comparar'
            };
        }

        const comparison = validProducts.map(product => ({
            name: product.name,
            price: product.price,
            rating: product.rating,
            features: product.features,
            warranty: product.warranty,
            stock: product.stock,
            image: product.image
        }));

        return {
            success: true,
            products: comparison,
            message: `He comparado ${validProducts.length} productos:`
        };
    }

    async getCustomerOrderHistory(customerId: string) {
        const orders = await this.orderService.findByCustomer(customerId);
    
        return {
            totalOrders: orders.length,
            totalSpent: orders.reduce((sum, order) => sum + order.total, 0),
            recentOrders: orders.slice(0, 5).map(order => ({
                id: order.id,
                date: order.date,
                total: order.total,
                status: order.status,
                items: order.items.length
            })),
            favoriteCategory: this.calculateFavoriteCategory(orders)
        };
    }

    async getPaymentMethodsInfo() {
        const methods = await this.paymentService.getAvailableMethods();
        const installmentInfo = await this.paymentService.getInstallmentOptions();

        return {
            methods: methods.map(method => ({
                type: method.type,
                name: method.name,
                description: method.description,
                fees: method.fees,
                limits: method.limits
            })),
            installments: installmentInfo,
            securityInfo: {
                encrypted: true,
                fraudProtection: true,
                moneyBackGuarantee: true
            }
        };
    }

    async getWarrantyInfo(productQuery: string) {
        const product = await this.productService.findByQuery(productQuery);
    
        if (!product) {
        return {
            found: false,
            message: `No encontré el producto "${productQuery}"`
        };
        }

        const warranty = await this.productService.getWarrantyInfo(product.id);

        return {
            found: true,
            product: product.name,
            warranty: {
                duration: warranty.duration,
                type: warranty.type,
                coverage: warranty.coverage,
                conditions: warranty.conditions,
                contact: warranty.contactSupport
            },
            message: `Garantía de ${product.name}: ${warranty.duration} - ${warranty.type}`
        };
    }

    private calculateFavoriteCategory(orders: any[]): string {
        // Lógica para calcular categoría favorita
        const categoryCount = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
            });
        });
    
        return Object.keys(categoryCount).reduce((a, b) => 
        categoryCount[a] > categoryCount[b] ? a : b
        );
    }
} */