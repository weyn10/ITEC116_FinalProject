import { Injectable, NotFoundException } from '@nestjs/common';
          import { InjectRepository } from '@nestjs/typeorm';
          import { Repository } from 'typeorm';
          import { Reservation } from './reservation.entity';
          import { CreateReservationDto, UpdateReservationDto } from './reservation.dto';

          @Injectable()
          export class ReservationService {
            constructor(@InjectRepository(Reservation) private readonly repo: Repository<Reservation>) {}

            findAll() {
              return this.repo.find({ relations: ['guest', 'room'], order: { id: 'DESC' } });
            }

            async findOne(id: number) {
              const item = await this.repo.findOne({ where: { id }, relations: ['guest', 'room'] });
              if (!item) throw new NotFoundException('Reservation not found');
              return item;
            }

            async create(dto: CreateReservationDto) {
              const data: any = { ...dto };
              data.guest = { id: dto.guestid };
    data.room = { id: dto.roomid };
              delete data.guestid;
    delete data.roomid;
              return this.repo.save(this.repo.create(data));
            }

            async update(id: number, dto: UpdateReservationDto) {
              const item = await this.findOne(id);
              const data: any = { ...dto };
              if (dto.guestid !== undefined) data.guest = { id: dto.guestid };
    if (dto.roomid !== undefined) data.room = { id: dto.roomid };
              delete data.guestid;
    delete data.roomid;
              Object.assign(item, data);
              return this.repo.save(item);
            }

            async remove(id: number) {
              const item = await this.findOne(id);
              await this.repo.remove(item);
              return { deleted: true, id };
            }

            async count() {
              return { total: await this.repo.count() };
            }
          }
