import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { JwtPayload } from '../auth/jwt.strategy';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { UploadFileDto } from './dto/upload-file.dto';
import { FilesService, UploadResult } from './files.service';

@ApiTags('files')
@ApiBearerAuth()
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.env.UPLOAD_DIR ?? './uploads',
        filename: (_req, _file, cb) => {
          cb(null, uuidv4());
        },
      }),
      limits: { fileSize: 1_073_741_824 },
    }),
  )
  @ApiOperation({ summary: 'Upload un fichier (authentifié)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: { type: 'string', format: 'binary' },
        expiresAt: {
          type: 'string',
          format: 'date-time',
          description: "Date d'expiration (max 7 jours)",
        },
      },
    },
  })
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadFileDto,
    @Request() req: { user: JwtPayload },
  ): Promise<UploadResult> {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni.');
    }

    return this.filesService.uploadFile(file, req.user.sub, dto.expiresAt);
  }
}