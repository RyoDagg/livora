import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { v2 } from 'cloudinary';

@Module({
  controllers: [FilesController],
  providers: [
    FilesService,
    {
      provide: 'CLOUDINARY',
      useFactory: () => {
        return v2.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });
      },
    },
  ],
})
export class FilesModule {}
