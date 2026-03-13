import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/database/core/users.entity';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { WorkoutsService } from './workouts.service';

@Controller('workouts')
@UseGuards(AuthGuard('jwt'))
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Post()
  create(
    @Req() req: { user: User },
    @Body() createWorkoutDto: CreateWorkoutDto,
  ) {
    return this.workoutsService.create(req.user.id, createWorkoutDto);
  }

  @Get()
  findAll(@Req() req: { user: User }) {
    return this.workoutsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Req() req: { user: User }, @Param('id') id: string) {
    return this.workoutsService.findOne(req.user.id, id);
  }

  @Patch(':id')
  update(
    @Req() req: { user: User },
    @Param('id') id: string,
    @Body() updateWorkoutDto: UpdateWorkoutDto,
  ) {
    return this.workoutsService.update(req.user.id, id, updateWorkoutDto);
  }

  @Delete(':id')
  remove(@Req() req: { user: User }, @Param('id') id: string) {
    return this.workoutsService.remove(req.user.id, id);
  }
}
