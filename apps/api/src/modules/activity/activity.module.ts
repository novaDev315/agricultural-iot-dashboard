import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [ActivityController],
  providers: [ActivityService],
  exports: [ActivityService],
})
export class ActivityModule {}
