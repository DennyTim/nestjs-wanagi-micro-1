import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { ProductCategory } from "../product-categories/product-categories.entity";
import { BookProperties } from "./models/book-properties.model";
import { CarProperties } from "./models/car-properties.model";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @ManyToOne(
    () => ProductCategory,
    (category: ProductCategory) => category.products
  )
  public category: ProductCategory;

  @Column({
    type: "jsonb"
  })
  public properties: CarProperties | BookProperties;
}

