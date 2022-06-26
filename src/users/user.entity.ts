import { Expose } from "class-transformer";
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Address } from "./address.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ unique: true })
  @Expose()
  public email: string;

  @Column()
  @Expose()
  public name: string;

  @Column()
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
  @Expose()
  public address: Address;
}
