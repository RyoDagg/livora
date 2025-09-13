import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class ListingsService {
  constructor(private prismaService: PrismaService) {}

  create(data: Prisma.ListingCreateInput) {
    return this.prismaService.listing.create({ data });
  }

  findAll() {
    return this.prismaService.listing.findMany({
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
