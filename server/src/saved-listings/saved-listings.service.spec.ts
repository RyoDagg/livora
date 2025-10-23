import { Test, TestingModule } from '@nestjs/testing';
import { SavedListingsService } from './saved-listings.service';

describe('SavedListingsService', () => {
  let service: SavedListingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SavedListingsService],
    }).compile();

    service = module.get<SavedListingsService>(SavedListingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
