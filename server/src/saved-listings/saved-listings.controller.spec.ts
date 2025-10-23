import { Test, TestingModule } from '@nestjs/testing';
import { SavedListingsController } from './saved-listings.controller';
import { SavedListingsService } from './saved-listings.service';

describe('SavedListingsController', () => {
  let controller: SavedListingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SavedListingsController],
      providers: [SavedListingsService],
    }).compile();

    controller = module.get<SavedListingsController>(SavedListingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
