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
    return await this.prisma.savedListing.findMany({
      where: { userId },
      include: { listing: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async isListingSaved(userId: string, listingId: string) {
    const count = await this.prisma.savedListing.count({
      where: { userId, listingId },
    });
    return count > 0;
  }
}
