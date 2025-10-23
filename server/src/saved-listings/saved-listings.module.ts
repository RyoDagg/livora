import { Module } from '@nestjs/common';
import { SavedListingsService } from './saved-listings.service';
import { SavedListingsController } from './saved-listings.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [SavedListingsController],
  providers: [SavedListingsService, PrismaService],
})
export class SavedListingsModule {}
