import {
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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBearerAuth } from '@nestjs/swagger'
import { UserRole } from '@prisma/client'
import { Request } from 'express'
import { Roles } from '../auth/decorators/roles.decorator'
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
@ApiBearerAuth()
export class FairsController {
  constructor(private readonly fairsService: FairsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MERCADEO)
  create(@Body() createFairDto: CreateFairDto) {
    return this.fairsService.create(createFairDto)
  }

  @Put(':fairId/logo')
  @Roles(UserRole.ADMIN, UserRole.MERCADEO)
  @UseInterceptors(FileInterceptor('logo'))
  upsertLogo(
    @Param('fairId') fairId: string,
    @UploadedFile(parseImagePipe) file: Express.Multer.File,
  ) {
    return this.fairsService.upsertLogo(fairId, file)
  }

  @Get()
  findAll(@Req() req: Request) {
    const user = req.user!
    return this.fairsService.findAll(user)
  }

  @Get(':fairId')
  findOne(@Param('fairId') fairId: string, @Req() req: Request) {
    const user = req.user!
    return this.fairsService.findOne(fairId, user)
  }

  @Patch(':fairId')
  @Roles(UserRole.ADMIN, UserRole.MERCADEO)
  update(
    @Param('fairId') fairId: string,
    @Body() updateFairDto: UpdateFairDto,
  ) {
    return this.fairsService.update(fairId, updateFairDto)
  }
}
