import { Exclude } from "class-transformer";
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import Post from "../posts/entities/post.entity";
import { Address } from "./address.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ unique: true })
  public email: string;

  @Column()
  public name: string;

  @Column()
  @Exclude()
  public password: string;

  /**
   * @eager - If we want our related entities always to be included
   * instead of: ```this.addressRepository.find({ relations: ["user"] });```
   * and separated route where we should create Address API
   * @cascade - for saving Address entities via User API
   * */
  @OneToOne(
    () => Address,
    {
      eager: true,
      cascade: true
    }
  )
  @JoinColumn()
  public address: Address;

  @OneToMany(() => Post, (post: Post) => post.author)
  public posts: Post[];
}
