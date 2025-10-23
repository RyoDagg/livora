import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SavedListingsService {
  constructor(private prisma: PrismaService) {}

  async saveListing(userId: string, listingId: string) {
    await this.prisma.savedListing.create({
      data: { userId, listingId },
    });
  }

  async unsaveListing(userId: string, listingId: string) {
    await this.prisma.savedListing.deleteMany({
      where: { userId, listingId },
    });
  }

  async getSavedListings(userId: string) {
    const savedListings = await this.prisma.savedListing.findMany({
      where: { userId },
      include: { listing: { include: { owner: true, savedBy: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return savedListings.map((record) => record.listing);
  }

  async isListingSaved(userId: string, listingId: string) {
    const count = await this.prisma.savedListing.count({
      where: { userId, listingId },
    });

    return count > 0;
  }
}
