import { Test, TestingModule } from '@nestjs/testing';
import { FrendService } from './frend.service';

describe('FrendService', () => {
  let service: FrendService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FrendService],
    }).compile();

    service = module.get<FrendService>(FrendService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
