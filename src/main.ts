import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponeInterceptor } from './interceptor/response.interceptor';

async function bootstrap() {
  // Create the NestJS application instance
  const app = await NestFactory.create(AppModule);

  // Get the Reflector instance for use in interceptors
  const reflector = app.get(Reflector);

  // Apply global validation pipes for request validation
  app.useGlobalPipes(new ValidationPipe());

  // Apply a global response interceptor
  app.useGlobalInterceptors(new ResponeInterceptor(reflector));

  // Configure Swagger for API documentation
  const config = new DocumentBuilder()
    .setTitle('Task1 example') // Set the title of the API documentation
    .setDescription('The task1 basic API description') // Provide a description for the API
    .setVersion('0.1') // Specify the version of the API
    .addTag('simple one module task.') // Add a tag for grouping endpoints
    .build();

  // Create the Swagger document
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  // Set up the Swagger UI at the '/api' endpoint
  SwaggerModule.setup('api', app, documentFactory);

  // Start the application and listen on the specified port
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
