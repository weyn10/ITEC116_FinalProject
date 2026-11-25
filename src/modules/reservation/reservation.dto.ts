import { IsString, IsNumber, IsInt, IsEmail, IsDateString, IsOptional, IsNotEmpty, IsIn, Min, Max } from 'class-validator';
          import { PartialType } from '@nestjs/mapped-types';
          export class CreateReservationDto {
            @IsDateString() checkindate: Date;
@IsDateString() checkoutdate: Date;
@IsString() @IsNotEmpty() status: string;
@IsInt() @Min(1) guestid: number;
@IsInt() @Min(1) roomid: number;
          }
          export class UpdateReservationDto extends PartialType(CreateReservationDto) {}
