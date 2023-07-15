import { Logger } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';

import { AppModule } from './app.module';
import { setupSwagger } from './setup-swagger';
// import { ConfigService } from '@nestjs/config';
import { ApiTransformInterceptor } from './common/api.transform';
import { ConfigService } from '@nestjs/config';

const SERVER_PORT = process.env.SERVER_PORT;
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
    },
  });

  const config = app.get(ConfigService);

  app.enableCors();
  // execption
  // app.useGlobalFilters(new ApiExceptionFilter(app.get(LoggerService)));
  // api interceptor
  app.useGlobalInterceptors(new ApiTransformInterceptor(new Reflector()));

  // swagger
  setupSwagger(app);
  // start
  await app.listen(SERVER_PORT, '0.0.0.0');
  const serverUrl = await app.getUrl();
  Logger.log(`api服务已经启动,请访问: ${serverUrl}`);
  Logger.log(`API文档已生成,请访问: ${serverUrl}${process.env.SWAGGER_PATH}/`);
}

bootstrap();
