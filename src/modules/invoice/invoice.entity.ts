import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Reservation } from '../reservation/reservation.entity';

          @Entity('invoices')
          export class Invoice {
            @PrimaryGeneratedColumn() id: number;
            @Column({ name: 'InvoiceNumber', type: 'varchar', length: 255 }) invoicenumber: string;
@Column({ name: 'TotalAmount', type: 'decimal', precision: 12, scale: 2 }) totalamount: number;
@Column({ name: 'PaymentStatus', type: 'varchar', length: 255 }) paymentstatus: string;
@ManyToOne(() => Reservation, { onDelete: 'RESTRICT' }) @JoinColumn({ name: 'ReservationID' }) reservation: Reservation;
            @CreateDateColumn() createdAt: Date;
            @UpdateDateColumn() updatedAt: Date;
          }
