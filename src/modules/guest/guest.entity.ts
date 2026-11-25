import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';


          @Entity('guests')
          export class Guest {
            @PrimaryGeneratedColumn() id: number;
            @Column({ name: 'FullName', type: 'varchar', length: 255 }) fullname: string;
@Column({ name: 'Email', type: 'varchar', length: 255 }) email: string;
@Column({ name: 'Phone', type: 'varchar', length: 255, nullable: true }) phone: string;
            @CreateDateColumn() createdAt: Date;
            @UpdateDateColumn() updatedAt: Date;
          }
