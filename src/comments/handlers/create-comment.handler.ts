import {
  CommandHandler,
  ICommandHandler
} from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CommentEntity } from "../comment.entity";
import { CreateCommentCmd } from "../commands/create-comment.cmd";

@CommandHandler(CreateCommentCmd)
export class CreateCommentHandler implements ICommandHandler<CreateCommentCmd> {
  constructor(
    @InjectRepository(CommentEntity)
    private commentsRepository: Repository<CommentEntity>
  ) {
  }

  async execute(command: CreateCommentCmd) {
    const newPost = await this.commentsRepository.create({
      ...command.comment,
      author: command.author
    });
    await this.commentsRepository.save(newPost);
    return newPost;
  }
}
