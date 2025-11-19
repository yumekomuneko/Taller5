import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true, 
      transform: true,
    }));

    app.enableCors({
      origin: process.env.CORS_ORIGIN || true,
      credentials: true,
    });
    const port = process.env.PORT || 3000;


    await app.listen(port);

    console.log(`La aplicación E-BOND corre por el puerto ${port}`);

  } catch (error) {
    console.error('Error al iniciar aplicacion :', error);
    process.exit(1);
  }

  
}


bootstrap();
