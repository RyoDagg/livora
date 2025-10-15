import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
  Req,
  InternalServerErrorException,
  Query,
  ForbiddenException,
  Put,
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import { Prisma } from '@prisma/client';
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
  async findAll(@Query() query: any) {
    const listings = await this.listingsService.findAll(query);
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

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() body: Prisma.ListingUpdateInput,
    @Req() req: any,
  ) {
    const listing = await this.listingsService.findOne(id);

    if (!listing || listing.ownerId !== req.user.userId) {
      throw new ForbiddenException('Not allowed to update this listing');
    }

    const updated = await this.listingsService.update(id, body);

    return { ok: true, data: updated };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Req() req: any) {
    const listing = await this.listingsService.findOne(id);

    if (!listing || listing.ownerId !== req.user.userId) {
      throw new ForbiddenException('Not allowed to update this listing');
    }

    await this.listingsService.remove(id);
    return { ok: true };
  }
}
