import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ name: 'UserID' }) id: number;
  @Column({ name: 'FullName', length: 100 }) fullName: string;
  @Column({ name: 'Email', length: 160, unique: true }) email: string;
  @Column({ name: 'PasswordHash', length: 255, select: false }) passwordHash: string;
  @Column({ name: 'Role', length: 30, default: 'user' }) role: string;
  @CreateDateColumn({ name: 'CreatedAt' }) createdAt: Date;
  @UpdateDateColumn({ name: 'UpdatedAt' }) updatedAt: Date;
}
