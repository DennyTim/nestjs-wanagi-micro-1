import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { JwtAuthenticationGuard } from "../auth/guards/jwt-authentication.guard";
import { CreateProductDto } from "./create-product.dto";
import { GetBrandDto } from "./get-brand.dto";
import { ProductsService } from "./products.service";

@Controller("products")
@UseInterceptors(ClassSerializerInterceptor)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {
  }

  @Get()
  getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @Get("/brands")
  getAllBrands() {
    return this.productsService.getAllBrands();
  }

  @Get("/brands/:brandId")
  async getComments(@Param() { brandId }: GetBrandDto) {
    return this.productsService.getBrand(brandId);
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createProduct(@Body() product: CreateProductDto) {
    return this.productsService.createProduct(product);
  }
}
