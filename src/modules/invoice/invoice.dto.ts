import { IsString, IsNumber, IsInt, IsEmail, IsDateString, IsOptional, IsNotEmpty, IsIn, Min, Max } from 'class-validator';
          import { PartialType } from '@nestjs/mapped-types';
          export class CreateInvoiceDto {
            @IsString() @IsNotEmpty() invoicenumber: string;
@IsNumber({ maxDecimalPlaces: 2 }) @Min(0) totalamount: number;
@IsString() @IsNotEmpty() paymentstatus: string;
@IsInt() @Min(1) reservationid: number;
          }
          export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {}
