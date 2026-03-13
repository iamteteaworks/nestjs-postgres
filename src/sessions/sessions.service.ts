import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from 'src/database/core/sessions.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { User } from 'src/database/core/users.entity';
import { Status } from 'src/enum/session.enum';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionsRepo: Repository<Session>,
  ) {}

  async create(userId: string, dto: CreateSessionDto): Promise<Session[]> {
    const created: Session[] = [];

    for (const d of dto.dates ?? []) {
      const entity = this.sessionsRepo.create({
        name: dto.name,
        date: d.date as unknown as Date,
        startTime: dto.startTime,
        endTime: dto.endTime,
        status: Status.OPEN,
        user: { id: userId } as unknown as User,
      });
      const saved = await this.sessionsRepo.save(entity);
      created.push(saved);
    }

    return created;
  }

  async findAll(userId: string, date?: string): Promise<Session[]> {
    const baseWhere = { user: { id: userId } };

    return this.sessionsRepo.find({
      where: date ? { ...baseWhere, date: date as unknown as Date } : baseWhere,
      order: { date: 'ASC', startTime: 'ASC' },
    });
  }

  async findOne(userId: string, id: string): Promise<Session> {
    const session = await this.sessionsRepo.findOne({
      where: { id, user: { id: userId } },
    });
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    return session;
  }

  async remove(userId: string, id: string): Promise<void> {
    const session = await this.findOne(userId, id);
    await this.sessionsRepo.softRemove(session);
  }
}
