import * as Joi from "@hapi/joi";
import { Module } from "@nestjs/common";
import {
  ConfigModule,
  ConfigService
} from "@nestjs/config";
import { APP_FILTER } from "@nestjs/core";
import { GraphQLModule } from "@nestjs/graphql";
import { ScheduleModule } from "@nestjs/schedule";
import { join } from "path";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthenticationModule } from "./auth/authentication.module";
import { CategoriesModule } from "./categories/category.module";
import { CommentsModule } from "./comments/comments.module";
import { DatabaseModule } from "./database/database.module";
import { EmailSchedulerModule } from "./email-scheduler/email-scheduler.module";
import { EmailModule } from "./email/email.module";
import { PostsModule } from "./posts/posts.module";
import { ProductCategoriesModule } from "./product-categories/product-category.module";
import { ProductsModule } from "./products/products.module";
import { SubscribersModule } from "./subscribers/subscribers.module";
import { ExceptionsLoggerFilter } from "./utils/exceptions-logger.filter";

@Module({
  imports: [
    DatabaseModule,
    PostsModule,
    AuthenticationModule,
    CategoriesModule,
    SubscribersModule,
    CommentsModule,
    ProductsModule,
    ProductCategoriesModule,
    EmailModule,
    EmailSchedulerModule,
    ScheduleModule.forRoot(),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        playground: Boolean(configService.get("GRAPHQL_PLAYGROUND")),
        autoSchemaFile: join(process.cwd(), "src/schema.gql")
      })
    }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        EMAIL_SERVICE: Joi.string().required(),
        EMAIL_USER: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        GRAPHQL_PLAYGROUND: Joi.number()
      })
    })
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ExceptionsLoggerFilter
    }
  ]
})
export class AppModule {
}
