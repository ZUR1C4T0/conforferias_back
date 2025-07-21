import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { UserRole } from '@prisma/client'
import { Request } from 'express'
import { Roles } from '../auth/decorators/roles.decorator'
import { StorageService } from '../storage/storage.service'
import { CreateFairDto } from './dto/create-fair.dto'
import { UpdateFairDto } from './dto/update-fair.dto'
import { FairsService } from './fairs.service'

const parseImagePipe = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({
      maxSize: 5 * 1024 * 1024,
      message: 'File too large, max size is 5MB',
    }),
    new FileTypeValidator({
      fileType: 'image/*',
    }),
  ],
})

@Controller('fairs')
export class FairsController {
  constructor(
    private readonly fairsService: FairsService,
    private readonly storageService: StorageService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MERCADEO)
  @UseInterceptors(FileInterceptor('logo'))
  async create(
    @Body() createFairDto: CreateFairDto,
    @UploadedFile(parseImagePipe) file: Express.Multer.File | undefined,
  ) {
    if (!file) throw new BadRequestException('File not found')
    const logoUrl = await this.storageService.uploadFile(file)
    return this.fairsService.create({ ...createFairDto, logoUrl })
  }

  @Get()
  findAll(@Req() req: Request) {
    const user = req.user!
    return this.fairsService.findAll(user)
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    const user = req.user!
    return this.fairsService.findOne(id, user)
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MERCADEO)
  update(@Param('id') id: string, @Body() updateFairDto: UpdateFairDto) {
    return this.fairsService.update(id, updateFairDto)
  }

  @Put(':id/logo')
  @Roles(UserRole.ADMIN, UserRole.MERCADEO)
  @UseInterceptors(FileInterceptor('logo'))
  async updateLogo(
    @Param('id') id: string,
    @UploadedFile(parseImagePipe) file: Express.Multer.File | undefined,
  ) {
    if (!file) throw new BadRequestException('File not found')
    const logoUrl = await this.storageService.uploadFile(file)
    return this.fairsService.updateLogo(id, logoUrl)
  }
}
