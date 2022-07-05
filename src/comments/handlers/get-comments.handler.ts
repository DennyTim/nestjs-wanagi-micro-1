import {
  IQueryHandler,
  QueryHandler
} from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GetCommentsQuery } from "../commands/get-comments.query";
import { CommentEntity } from "../comment.entity";

@QueryHandler(GetCommentsQuery)
export class GetCommentsHandler implements IQueryHandler<GetCommentsQuery> {
  constructor(
    @InjectRepository(CommentEntity)
    private commentsRepository: Repository<CommentEntity>
  ) {
  }

  async execute(query: GetCommentsQuery) {
    if (query.postId) {
      return this.commentsRepository.find({
        where: { post: { id: query.postId } }
      });
    }
    return this.commentsRepository.find();
  }
}
