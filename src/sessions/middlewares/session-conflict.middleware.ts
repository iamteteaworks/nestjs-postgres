import { ConflictException, Injectable, NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NextFunction, Request, Response } from 'express';
import { Repository } from 'typeorm';
import { Session } from 'src/database/core/sessions.entity';

@Injectable()
export class SessionConflictMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(Session)
    private readonly sessionsRepo: Repository<Session>,
  ) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    if (req.method !== 'POST') return next();

    const { startTime, endTime, dates } = req.body as {
      startTime?: string;
      endTime?: string;
      dates?: { date: string }[];
    };

    if (!startTime || !endTime || !Array.isArray(dates)) return next();

    for (const d of dates) {
      const conflict = await this.sessionsRepo
        .createQueryBuilder('session')
        .where('session.date = :date', { date: d.date })
        .andWhere('session.startTime < :newEnd', { newEnd: endTime })
        .andWhere('session.endTime > :newStart', { newStart: startTime })
        .getOne();

      if (conflict) {
        throw new ConflictException(
          'A session with overlapping time already exists for this date.',
        );
      }
    }

    return next();
  }
}
