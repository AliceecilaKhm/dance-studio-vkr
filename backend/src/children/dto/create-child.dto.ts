import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { ChildStatus } from '../../generated/prisma/enums';

export class CreateChildDto {
  @IsInt()
  @Min(1)
  groupId!: number;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsOptional()
  @IsString()
  middleName?: string | null;

  @IsOptional()
  @IsDateString()
  birthDate?: string | null;

  @IsOptional()
  @IsInt()
  heightCm?: number | null;

  @IsOptional()
  @IsNumber()
  shoeSize?: number | null;

  @ValidateIf((_, value) => value !== undefined)
  @IsEnum(ChildStatus)
  status?: ChildStatus;
}
