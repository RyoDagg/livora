import { Module } from '@nestjs/common';
import { SavedListingsService } from './saved-listings.service';
import { SavedListingsController } from './saved-listings.controller';

@Module({
  controllers: [SavedListingsController],
  providers: [SavedListingsService],
})
export class SavedListingsModule {}
