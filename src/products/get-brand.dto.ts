import { Type } from "class-transformer";

export class GetBrandDto {
  @Type(() => Number)
  brandId: number;
}
