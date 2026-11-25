import { Injectable, NotFoundException } from '@nestjs/common';
          import { InjectRepository } from '@nestjs/typeorm';
          import { Repository } from 'typeorm';
          import { Invoice } from './invoice.entity';
          import { CreateInvoiceDto, UpdateInvoiceDto } from './invoice.dto';

          @Injectable()
          export class InvoiceService {
            constructor(@InjectRepository(Invoice) private readonly repo: Repository<Invoice>) {}

            findAll() {
              return this.repo.find({ relations: ['reservation'], order: { id: 'DESC' } });
            }

            async findOne(id: number) {
              const item = await this.repo.findOne({ where: { id }, relations: ['reservation'] });
              if (!item) throw new NotFoundException('Invoice not found');
              return item;
            }

            async create(dto: CreateInvoiceDto) {
              const data: any = { ...dto };
              data.reservation = { id: dto.reservationid };
              delete data.reservationid;
              return this.repo.save(this.repo.create(data));
            }

            async update(id: number, dto: UpdateInvoiceDto) {
              const item = await this.findOne(id);
              const data: any = { ...dto };
              if (dto.reservationid !== undefined) data.reservation = { id: dto.reservationid };
              delete data.reservationid;
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
