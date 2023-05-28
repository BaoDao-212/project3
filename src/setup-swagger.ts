import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  // 默认为启用
  const config = app.get(ConfigService);
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Web Code')
    .setDescription('Web code')
    // JWT鉴权
    .addSecurity('admin', {
      description: 'webcode_authentic',
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
    })
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(config.get('swagger.path'), app, document);
}
