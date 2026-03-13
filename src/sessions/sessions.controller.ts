import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/database/core/users.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { SessionsService } from './sessions.service';

@Controller('sessions')
@UseGuards(AuthGuard('jwt'))
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  create(
    @Req() req: { user: User },
    @Body() createSessionDto: CreateSessionDto,
  ) {
    return this.sessionsService.create(req.user.id, createSessionDto);
  }

  @Get()
  findAll(@Req() req: { user: User }, @Query('date') date?: string) {
    return this.sessionsService.findAll(req.user.id, date);
  }

  @Delete(':id')
  remove(@Req() req: { user: User }, @Param('id') id: string) {
    return this.sessionsService.remove(req.user.id, id);
  }
}
