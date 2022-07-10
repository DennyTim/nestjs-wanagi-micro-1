import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsString,
  ValidateNested
} from "class-validator";
import { ObjectWithId } from "../utils/types/object-with-id.dto";

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateNested()
  @Type(() => ObjectWithId)
  category: ObjectWithId;
}
