import { Controller, Get } from "@nestjs/common";

// En un controlador temporal
@Controller('health')
export class HealthController {
    @Get()
    check() {
    return { 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV 
    };
    }
}