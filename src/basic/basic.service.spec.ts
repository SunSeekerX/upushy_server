import { Test, TestingModule } from '@nestjs/testing';
import { BasicService } from './basic.service';

describe('BasicService', () => {
  let service: BasicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BasicService],
    }).compile();

    service = module.get<BasicService>(BasicService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
