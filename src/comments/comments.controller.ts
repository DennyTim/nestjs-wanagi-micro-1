import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import {
  CommandBus,
  QueryBus
} from "@nestjs/cqrs";
import { JwtAuthenticationGuard } from "../auth/guards/jwt-authentication.guard";
import { RequestWithUser } from "../auth/models/requestWithUser.interface";
import { CreateCommentCmd } from "./commands/create-comment.cmd";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { GetCommentsDto } from "./dto/get-comments.dto";
import { GetCommentsQuery } from "./commands/get-comments.query";

@Controller("comments")
@UseInterceptors(ClassSerializerInterceptor)
export class CommentsController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus
  ) {
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createComment(
    @Body() comment: CreateCommentDto,
    @Req() req: RequestWithUser
  ) {
    const user = req.user;
    return this.commandBus.execute(new CreateCommentCmd(comment, user));
  }

  @Get()
  async getComments(@Query() { postId }: GetCommentsDto) {
    return this.queryBus.execute(new GetCommentsQuery(postId));
  }
}
