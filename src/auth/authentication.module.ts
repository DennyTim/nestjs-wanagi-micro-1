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
import { JwtRefreshTokenStrategy } from "./strategies/jwt-refresh.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    JwtModule.register({})
  ],
  providers: [
    AuthenticationService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy
  ],
  controllers: [AuthenticationController]
})
export class AuthenticationModule {
}
