import * as Joi from "@hapi/joi";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthenticationModule } from "./auth/authentication.module";
import { DatabaseModule } from "./database/database.module";
import { PostsModule } from "./posts/posts.module";

@Module({
  imports: [
    DatabaseModule,
    PostsModule,
    AuthenticationModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
      })
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
