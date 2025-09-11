import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
  Req,
  InternalServerErrorException,
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import { Prisma } from 'generated/prisma';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: Prisma.ListingCreateInput, @Req() req: any) {
    try {
      const listing = await this.listingsService.create({
        ...body,
        owner: { connect: { id: req.user.userId } },
      });
      return { ok: true, data: listing };
    } catch (error) {
      console.error('Error creating listing:', error);
      throw new InternalServerErrorException('Failed to create listing');
    }
  }

  @Get()
  async findAll() {
    const listings = await this.listingsService.findAll();
    return { ok: true, data: listings };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const listing = await this.listingsService.findOne(id);
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    return { ok: true, data: listing };
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
