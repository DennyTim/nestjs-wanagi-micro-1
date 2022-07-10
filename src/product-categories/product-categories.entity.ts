import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Product } from "../products/products.entity";

@Entity()
export class ProductCategory {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @OneToMany(
    () => Product,
    (product: Product) => product.category
  )
  public products: Product[];
}
