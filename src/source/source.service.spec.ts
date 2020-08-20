import { Test, TestingModule } from '@nestjs/testing'
import { SourceService } from './source.service'

describe('SourceService', () => {
  let service: SourceService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SourceService],
    }).compile()

    service = module.get<SourceService>(SourceService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
