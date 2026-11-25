import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './reservation.entity';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
@Module({ imports: [TypeOrmModule.forFeature([Reservation])], controllers: [ReservationController], providers: [ReservationService] })
export class ReservationModule {}
