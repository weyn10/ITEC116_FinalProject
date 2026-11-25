import { Injectable, NotFoundException } from '@nestjs/common';
          import { InjectRepository } from '@nestjs/typeorm';
          import { Repository } from 'typeorm';
          import { Room } from './room.entity';
          import { CreateRoomDto, UpdateRoomDto } from './room.dto';

          @Injectable()
          export class RoomService {
            constructor(@InjectRepository(Room) private readonly repo: Repository<Room>) {}

            findAll() {
              return this.repo.find({ order: { id: 'DESC' } });
            }

            async findOne(id: number) {
              const item = await this.repo.findOne({ where: { id } });
              if (!item) throw new NotFoundException('Room not found');
              return item;
            }

            async create(dto: CreateRoomDto) {
              const data: any = { ...dto };
          
          
              return this.repo.save(this.repo.create(data));
            }

            async update(id: number, dto: UpdateRoomDto) {
              const item = await this.findOne(id);
              const data: any = { ...dto };
          
          
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
