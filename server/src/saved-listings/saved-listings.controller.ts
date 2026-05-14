import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SavedListingsService } from './saved-listings.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('saved-listings')
@UseGuards(JwtAuthGuard)
export class SavedListingsController {
  constructor(private readonly savedService: SavedListingsService) {}

  @Post(':listingId')
  async saveListing(
    @Param('listingId') listingId: string,
    @Request() req: any,
  ) {
    await this.savedService.saveListing(req.user.userId, listingId);
    return { message: 'Listing saved successfully' };
  }

  @Delete(':listingId')
  async unsaveListing(
    @Param('listingId') listingId: string,
    @Request() req: any,
  ) {
    await this.savedService.unsaveListing(req.user.userId, listingId);
    return { message: 'Listing unsaved successfully' };
  }

  @Get()
  async getSavedListings(@Request() req: any) {
    const savedListings = await this.savedService.getSavedListings(
      req.user.userId,
    );
    return savedListings;
  }

  @Get(':listingId')
  async isListingSaved(
    @Param('listingId') listingId: string,
    @Request() req: any,
  ) {
    const isSaved = await this.savedService.isListingSaved(
      req.user.userId,
      listingId,
    );
    return isSaved;
  }
}
