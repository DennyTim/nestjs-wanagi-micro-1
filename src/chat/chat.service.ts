import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WsException } from "@nestjs/websockets";
import { parse } from "cookie";
import { Socket } from "socket.io";
import { Repository } from "typeorm";
import { AuthenticationService } from "../auth/authentication.service";
import { UserEntity } from "../users/user.entity";
import { Message } from "./message.entity";

@Injectable()
export class ChatService {
  constructor(
    private readonly authService: AuthenticationService,
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>
  ) {
  }

  async saveMessage(content: string, author: UserEntity) {
    const newMessage = await this.messagesRepository.create({ content, author });
    await this.messagesRepository.save(newMessage);
    return newMessage;
  }

  async getAllMessages() {
    return this.messagesRepository.find({ relations: { author: true } });
  }

  async getUserFromSocket(socket: Socket) {
    const cookie = socket.handshake.headers.cookie;
    const { Authentication: authenticationToken } = parse(cookie);
    const user = await this.authService.getUserFromAuthenticationToken(authenticationToken);
    if (!user) {
      throw new WsException("Invalid credentials");
    }
    return user;
  }
}
