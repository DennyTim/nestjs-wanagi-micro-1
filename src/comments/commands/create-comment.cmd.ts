import { UserEntity } from "../../users/user.entity";
import { CreateCommentDto } from "../dto/create-comment.dto";

export class CreateCommentCmd {
  constructor(
    public readonly comment: CreateCommentDto,
    public readonly author: UserEntity,
  ) {
  }
}
