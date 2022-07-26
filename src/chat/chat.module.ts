import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthenticationModule } from "../auth/authentication.module";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";
import { Message } from "./message.entity";

@Module({
  imports: [
    AuthenticationModule,
    TypeOrmModule.forFeature([Message])
  ],
  controllers: [],
  providers: [ChatGateway, ChatService]
})
export class ChatModule {
}
