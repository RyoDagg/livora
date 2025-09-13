import { Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 } from 'cloudinary';

@Injectable()
export class FilesService {
  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const uploadResult = await new Promise((resolve, reject) => {
        v2.uploader
          .upload_stream(
            { resource_type: 'auto', folder: 'livora' },
            (error, uploadResult) => {
              if (error) {
                return reject(error);
              }
              return resolve(uploadResult);
            },
          )
          .end(file.buffer);
      });

      return (uploadResult as UploadApiResponse).secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw new Error('Failed to upload file');
    }
  }
}
