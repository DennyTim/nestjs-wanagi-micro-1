import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Category } from "../../categories/category.entity";
import { UserEntity } from "../../users/user.entity";

@Entity()
class PostEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column('text', { array: true })
  public paragraphs: string[];

  @Index('post_authorId_index')
  @ManyToOne(() => UserEntity, (author: UserEntity) => author.posts)
  public author: UserEntity;

  @ManyToMany(() => Category, (category: Category) => category.posts)
  @JoinTable()
  public categories: Category[];
}

export default PostEntity;
