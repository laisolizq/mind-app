import { Controller, Get, Body, Post } from '@nestjs/common';
import { CreateThoughtDto } from './create-thought.dto.js';

@Controller('thoughts')
export class ThoughtsController {
  @Get()
  getThoughts() {
    return [
      {
        text: 'Ir al gimnasio',
        timing: 'today',
      },
      {
        text: 'Mirar hoteles para Japón',
        timing: 'soon',
      },
    ];
  }

  @Post()
  createThought(@Body() createThoughtDto: CreateThoughtDto) {
    return createThoughtDto;
  }
}