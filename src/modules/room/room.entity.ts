import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';


          @Entity('rooms')
          export class Room {
            @PrimaryGeneratedColumn() id: number;
            @Column({ name: 'RoomNumber', type: 'varchar', length: 255 }) roomnumber: string;
@Column({ name: 'RoomType', type: 'varchar', length: 255 }) roomtype: string;
@Column({ name: 'Rate', type: 'decimal', precision: 12, scale: 2 }) rate: number;
@Column({ name: 'Status', type: 'varchar', length: 255 }) status: string;
            @CreateDateColumn() createdAt: Date;
            @UpdateDateColumn() updatedAt: Date;
          }
