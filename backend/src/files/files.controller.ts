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
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('Files')
@ApiBearerAuth()
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, _file, cb) => {
          const user = req.user as JwtPayload;
          const userDir = path.join(
            process.env.UPLOAD_DIR ?? './uploads',
            user.sub,
          );
          fs.mkdirSync(userDir, { recursive: true });
          cb(null, userDir);
        },
        filename: (_req, file, cb) => {
          const ext = path.extname(file.originalname).toLowerCase();
          cb(null, `${uuidv4()}${ext}`);
        },
      }),
      limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE ?? '1073741824', 10),
      },
    }),
  )
  @ApiOperation({ summary: 'Upload a file (authenticated)' })
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
          description: 'Expiration date (max 7 days)',
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
      throw new BadRequestException('No file provided.');
    }

    return this.filesService.uploadFile(file, req.user.sub, dto.expiresAt);
  }
}
