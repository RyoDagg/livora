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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { GetListingsQueryDto } from './dto/get-listings-query.dto';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: CreateListingDto, @Req() req: any) {
    try {
      const listing = await this.listingsService.create({
        ...body,
        availableAt: new Date(body.availableAt),
        owner: { connect: { id: req.user.userId } },
      });
      return { ok: true, data: listing };
    } catch (error) {
      console.error('Error creating listing:', error);
      throw new InternalServerErrorException('Failed to create listing');
    }
  }

  @Get()
  async findAll(@Query() query: GetListingsQueryDto) {
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
    @Body() body: UpdateListingDto,
    @Req() req: any,
  ) {
    const listing = await this.listingsService.findOne(id);

    if (!listing || listing.ownerId !== req.user.userId) {
      throw new ForbiddenException('Not allowed to update this listing');
    }

    const updated = await this.listingsService.update(id, {
      ...body,
      ...(body.availableAt ? { availableAt: new Date(body.availableAt) } : {}),
    });

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
