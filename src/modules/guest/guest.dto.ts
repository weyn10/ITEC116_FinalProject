import { IsString, IsNumber, IsInt, IsEmail, IsDateString, IsOptional, IsNotEmpty, IsIn, Min, Max } from 'class-validator';
          import { PartialType } from '@nestjs/mapped-types';
          export class CreateGuestDto {
            @IsString() @IsNotEmpty() fullname: string;
@IsEmail() email: string;
@IsString() @IsOptional() phone: string;
          }
          export class UpdateGuestDto extends PartialType(CreateGuestDto) {}
