import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ListingsService {
  constructor(private prismaService: PrismaService) {}

  create(data: Prisma.ListingCreateInput) {
    return this.prismaService.listing.create({ data });
  }

  findAll(filters?: {
    state?: string;
    type?: 'rent' | 'sale';
    priceMin?: number;
    priceMax?: number;
    ownerId?: string;
    query?: string;
  }) {
    const where: Prisma.ListingWhereInput = {};

    if (filters) {
      if (filters.ownerId) where.ownerId = filters.ownerId;
      if (filters.state) where.state = filters.state;
      if (filters.type) where.type = filters.type;

      if (filters.priceMin || filters.priceMax) {
        where.price = {};
        if (filters.priceMin) where.price.gte = filters.priceMin;
        if (filters.priceMax) where.price.lte = filters.priceMax;
      }

      if (filters.query) {
        where.OR = [
          { title: { contains: filters.query, mode: 'insensitive' } },
          { description: { contains: filters.query, mode: 'insensitive' } },
          { state: { contains: filters.query, mode: 'insensitive' } },
          { contact: { contains: filters.query, mode: 'insensitive' } },
        ];
      }
    }

    return this.prismaService.listing.findMany({
      where,
      include: { owner: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prismaService.listing.findUnique({
      where: { id },
      include: { owner: true },
    });
  }

  update(id: string, data: Prisma.ListingUpdateInput) {
    return this.prismaService.listing.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prismaService.listing.delete({ where: { id } });
  }
}
