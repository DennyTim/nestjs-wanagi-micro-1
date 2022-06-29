import { Module } from "@nestjs/common";
import {
  ConfigModule,
  ConfigService
} from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserEntity } from "../users/user.entity";
import { UsersModule } from "../users/users.module";
import { AuthenticationController } from "./authentication.controller";
import { AuthenticationService } from "./authentication.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET"),
        signOptions: {
          expiresIn: `${configService.get("JWT_EXPIRATION_TIME")}s`
        }
      })
    })
  ],
  providers: [
    AuthenticationService,
    LocalStrategy,
    JwtStrategy
  ],
  controllers: [AuthenticationController]
})
export class AuthenticationModule {
}
