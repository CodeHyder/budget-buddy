// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService {
  private users: User[] = [];

  create(dto: CreateUserDto): User {
    const newUser: User = { id: randomUUID(), ...dto };
    this.users.push(newUser);
    return newUser;
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User {
    const user = this.users.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    return user;
  }

  update(id: string, dto: UpdateUserDto): User {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    const updated = { ...this.users[index], ...dto };
    this.users[index] = updated;
    return updated;
  }

  remove(id: string): void {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    this.users.splice(index, 1);
  }
}
