import {
  Field,
  Int,
  ObjectType
} from "@nestjs/graphql";
import { UserEntity } from "../../users/user.entity";

@ObjectType()
export class Post {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field(() => [String])
  paragraphs: string[];

  @Field(() => Int)
  authorId: number;

  @Field()
  author: UserEntity;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  scheduledDate?: Date;
}
