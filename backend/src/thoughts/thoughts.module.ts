import { Module } from '@nestjs/common';
import { ThoughtsController } from './thoughts.controller.js';
import { ThoughtsService } from './thoughts.service.js';

@Module({
  controllers: [ThoughtsController],
  providers: [ThoughtsService]
})
export class ThoughtsModule {}
