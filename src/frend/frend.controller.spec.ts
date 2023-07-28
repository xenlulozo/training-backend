import { Test, TestingModule } from '@nestjs/testing';
import { FrendController } from './frend.controller';
import { FrendService } from './frend.service';

describe('FrendController', () => {
  let controller: FrendController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FrendController],
      providers: [FrendService],
    }).compile();

    controller = module.get<FrendController>(FrendController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
