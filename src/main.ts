import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // Enable transforming of validation errors to match the DTO structure
    whitelist: true, // Only transform provided properties in the request body
    disableErrorMessages: false, // Enable displaying detailed error messages in the response
    validationError: {
      target: false, // Disable transforming validation errors to the corresponding DTO structure
      value: false, // Disable transforming the value of validation errors to the corresponding DTO structure
    },
    exceptionFactory: (errors) => {
      const result = errors.map((error) => ({
        property: error.property,
        message: error.constraints[Object.keys(error.constraints)[0]],
      }));
      return new HttpException({
        success: false,
        status: 400,
        messages: result,
        data: [],
      }, 200)
    },
  }))
  await app.listen(5000);
}

bootstrap();
