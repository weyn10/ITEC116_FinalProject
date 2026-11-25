import { IsString, IsNumber, IsInt, IsEmail, IsDateString, IsOptional, IsNotEmpty, IsIn, Min, Max } from 'class-validator';
          import { PartialType } from '@nestjs/mapped-types';
          export class CreateRoomDto {
            @IsString() @IsNotEmpty() roomnumber: string;
@IsString() @IsNotEmpty() roomtype: string;
@IsNumber({ maxDecimalPlaces: 2 }) @Min(0) rate: number;
@IsString() @IsNotEmpty() status: string;
          }
          export class UpdateRoomDto extends PartialType(CreateRoomDto) {}
