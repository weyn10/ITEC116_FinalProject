import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Guest } from '../guest/guest.entity';
import { Room } from '../room/room.entity';

          @Entity('reservations')
          export class Reservation {
            @PrimaryGeneratedColumn() id: number;
            @Column({ name: 'CheckInDate', type: 'date' }) checkindate: Date;
@Column({ name: 'CheckOutDate', type: 'date' }) checkoutdate: Date;
@Column({ name: 'Status', type: 'varchar', length: 255 }) status: string;
@ManyToOne(() => Guest, { onDelete: 'RESTRICT' }) @JoinColumn({ name: 'GuestID' }) guest: Guest;
@ManyToOne(() => Room, { onDelete: 'RESTRICT' }) @JoinColumn({ name: 'RoomID' }) room: Room;
            @CreateDateColumn() createdAt: Date;
            @UpdateDateColumn() updatedAt: Date;
          }
