import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductCategoriesController } from "./product-categories.controller";
import { ProductCategory } from "./product-categories.entity";
import { ProductCategoriesService } from "./product-categories.service";

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategory])],
  controllers: [ProductCategoriesController],
  providers: [ProductCategoriesService],
})
export class ProductCategoriesModule {
}
