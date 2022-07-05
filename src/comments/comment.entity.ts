import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import PostEntity from "../posts/entities/post.entity";
import { UserEntity } from "../users/user.entity";

@Entity()
export class CommentEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public content: string;

  @ManyToOne(
    () => PostEntity,
    (post: PostEntity) => post.comments
  )
  public post: PostEntity;

  @ManyToOne(
    () => UserEntity,
    (author: UserEntity) => author.posts
  )
  public author: UserEntity;
}
