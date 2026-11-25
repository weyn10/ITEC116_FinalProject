import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { RegisterDto, LoginDto } from './auth.dto';
@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private users: Repository<User>, private jwt: JwtService) {}
  async register(dto: RegisterDto) {
    const exists = await this.users.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already registered');
    const user = this.users.create({ email: dto.email, fullName: dto.fullName, passwordHash: await bcrypt.hash(dto.password, 12) });
    const saved = await this.users.save(user);
    return { id: saved.id, email: saved.email, fullName: saved.fullName, role: saved.role };
  }
  async login(dto: LoginDto) {
    const user = await this.users.createQueryBuilder('u').addSelect('u.passwordHash').where('u.email = :email', { email: dto.email }).getOne();
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) throw new UnauthorizedException('Invalid email or password');
    return { access_token: await this.jwt.signAsync({ sub: user.id, email: user.email, role: user.role }), token_type: 'Bearer' };
  }
  async profile(id: number) {
    const user = await this.users.findOne({ where: { id }, select: ['id', 'email', 'fullName', 'role', 'createdAt'] });
    if (!user) throw new UnauthorizedException('User no longer exists');
    return user;
  }
}
