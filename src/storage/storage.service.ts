import { BadRequestException, Injectable } from '@nestjs/common'
import multer from 'multer'
import sharp from 'sharp'
import { R2Service } from './r2.service'

@Injectable()
export class StorageService {
  constructor(private readonly r2Service: R2Service) {}

  optimizeImage(file: Buffer): Promise<Buffer> {
    try {
      return sharp(file)
        .resize(1000, 1000, {
          fit: sharp.fit.cover,
          withoutEnlargement: true,
        })
        .webp({ quality: 85 })
        .toBuffer()
    } catch (_) {
      throw new BadRequestException('Invalid image format')
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new Error('No file provided for upload')
    }

    const optimizedImage = await this.optimizeImage(file.buffer)
    return await this.r2Service.uploadFile({
      buffer: optimizedImage,
      originalname: file.originalname,
      mimetype: file.mimetype,
    })
  }
}
