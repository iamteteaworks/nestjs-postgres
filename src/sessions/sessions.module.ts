import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from 'src/database/core/sessions.entity';
import { SessionConflictMiddleware } from './middlewares/session-conflict.middleware';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Session])],
  controllers: [SessionsController],
  providers: [SessionsService, SessionConflictMiddleware],
})
export class SessionsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SessionConflictMiddleware)
      .forRoutes({ path: 'sessions', method: RequestMethod.POST });
  }
}
