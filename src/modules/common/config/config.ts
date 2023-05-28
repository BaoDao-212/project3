import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
export const getConfiguration = () =>
  ({
    // jwt sign secret
    jwt: {
      secret: process.env.JWT_SECRET || '123456',
    },
    // typeorm config
    database: {
      type: 'postgres',
      host: process.env.HOST,
      port: Number.parseInt(process.env.PORT, 5432),
      username: process.env.USERNAME,
      password: process.env.PASSWORD || '',
      database: process.env.DATABASE,
      entities: [__dirname + '/../**/entities/*.entity.{ts,js}'],
      migrations: ['dist/src/migrations/**/*.js'],
      autoLoadEntities: true,
      synchronize: true,
      logging: ['error'],
      timezone: '+08:00', // 东八区
      cli: {
        migrationsDir: 'src/migrations',
      },
    } as PostgresConnectionOptions,
    // swagger
    swagger: {
      enable: process.env.SWAGGER_ENABLE === 'true',
      path: process.env.SWAGGER_PATH,
      title: process.env.SWAGGER_TITLE,
      post: process.env.SERVER_PORT,
      desc: process.env.SWAGGER_DESC,
      version: process.env.SWAGGER_VERSION,
    },
  } as const);
