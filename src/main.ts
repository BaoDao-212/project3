import { Logger } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';

import { AppModule } from './app.module';
import { setupSwagger } from './setup-swagger';
import { ConfigService } from '@nestjs/config';
import { ApiExceptionFilter } from './common/api-exception.filter';
import { ApiTransformInterceptor } from './common/api.transform';

const SERVER_PORT = process.env.SERVER_PORT;
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
    },
  });
  const config = app.get(ConfigService);
  const t = encodeURIComponent(
    `#include <stdio.h>

    int main() {
        int n, i, sum = 0;
        scanf("%d", &n);
        int arr[n];
        for (i = 0; i < n; i++) {
            scanf("%d", &arr[i]);
            sum += arr[i];
        }
        printf(" %d", sum);
        return 0;
    }
    `,
  );
  console.log(t);
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
