import { Test, TestingModule } from '@nestjs/testing';
import { ThoughtsController } from './thoughts.controller.js';

describe('ThoughtsController', () => {
  let controller: ThoughtsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThoughtsController],
    }).compile();

    controller = module.get<ThoughtsController>(ThoughtsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
