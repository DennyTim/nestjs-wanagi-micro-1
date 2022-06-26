import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  Res,
  SerializeOptions,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { Response } from "express";
import { AuthenticationService } from "./authentication.service";
import { RegisterDto } from "./dto/register.dto";
import { JwtAuthenticationGuard } from "./guards/jwt-authentication.guard";
import { LocalAuthenticationGuard } from "./guards/localAuthentication.guard";
import { RequestWithUser } from "./models/requestWithUser.interface";

@Controller("auth")
@SerializeOptions({
  strategy: "excludeAll"
})
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService
  ) {
  }

  @Post("register")
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }

  @UseGuards(LocalAuthenticationGuard)
  @Post("log-in")
  async logIn(@Req() request: RequestWithUser, @Res() response: Response) {
    const { user } = request;
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
    response.setHeader("Set-Cookie", cookie);
    response
      .status(200)
      .json({ ...user, id: undefined });
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post("log-out")
  async logOut(
    @Req() request: RequestWithUser,
    @Res() response: Response
  ) {
    response.setHeader("Set-Cookie", this.authenticationService.getCookieForLogOut());
    return response.sendStatus(200);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    return request.user;
  }
}
