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
    try {
      await this.savedService.saveListing(req.user.userId, listingId);
      return { ok: true };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  }

  @Delete(':listingId')
  async unsaveListing(
    @Param('listingId') listingId: string,
    @Request() req: any,
  ) {
    try {
      await this.savedService.unsaveListing(req.user.userId, listingId);
      return { ok: true };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  }

  @Get()
  async getSavedListings(@Request() req: any) {
    try {
      const savedListings = await this.savedService.getSavedListings(
        req.user.userId,
      );
      return { ok: true, data: savedListings };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  }

  @Get(':listingId')
  async isListingSaved(
    @Param('listingId') listingId: string,
    @Request() req: any,
  ) {
    try {
      const isSaved = await this.savedService.isListingSaved(
        req.user.userId,
        listingId,
      );
      return { ok: true, data: isSaved };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  }
}
