import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import { Prisma } from 'generated/prisma';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post()
  create(@Body() body: Prisma.ListingCreateInput) {
    return this.listingsService.create(body);
  }

  @Get()
  findAll() {
    return this.listingsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const listing = await this.listingsService.findOne(id);
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    return listing;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Prisma.ListingUpdateInput) {
    return this.listingsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listingsService.remove(id);
  }
}
