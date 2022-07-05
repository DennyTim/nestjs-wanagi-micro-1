import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentEntity } from "./comment.entity";
import { CommentsController } from "./comments.controller";
import { CreateCommentHandler } from "./handlers/create-comment.handler";
import { GetCommentsHandler } from "./handlers/get-comments.handler";

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([CommentEntity])
  ],
  controllers: [CommentsController],
  providers: [
    CreateCommentHandler,
    GetCommentsHandler
  ]
})
export class CommentsModule {
}
