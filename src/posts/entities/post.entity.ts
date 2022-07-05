import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Category } from "../../categories/category.entity";
import { CommentEntity } from "../../comments/comment.entity";
import { UserEntity } from "../../users/user.entity";

@Entity()
class PostEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column('text', { array: true })
  public paragraphs: string[];

  @OneToMany(
    () => CommentEntity,
    (comment: CommentEntity) => comment.post
  )
  public comments: Comment[];

  @Index('post_authorId_index')
  @ManyToOne(
    () => UserEntity,
    (author: UserEntity) => author.posts
  )
  public author: UserEntity;

  @ManyToMany(
    () => Category,
    (category: Category) => category.posts
  )
  @JoinTable()
  public categories: Category[];
}

export default PostEntity;
