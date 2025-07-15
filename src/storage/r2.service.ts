import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class R2Service {
  private s3Client: S3Client

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: 'auto', // Cloudflare R2 requiere "auto"
      endpoint: `https://${this.configService.get('R2_ACCOUNT_ID')}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: this.configService.get('R2_ACCESS_KEY') || '',
        secretAccessKey: this.configService.get('R2_SECRET_KEY') || '',
      },
    })
  }

  async uploadFile(file: {
    buffer: Buffer
    originalname: string
    mimetype: string
  }): Promise<string> {
    const key = `uploads/${Date.now()}-${file.originalname}`

    const command = new PutObjectCommand({
      Bucket: this.configService.get('R2_BUCKET_NAME'),
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })

    await this.s3Client.send(command)

    // Retorna la URL pública (asegúrate de tener permisos de lectura en R2)
    return `${this.configService.get('R2_PUBLIC_URL')}/${key}`
  }
}
