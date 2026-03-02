import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  StreamableFile,
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
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { JwtPayload } from '../auth/jwt.strategy';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { UploadFileDto } from './dto/upload-file.dto';
import {
  DeleteResult,
  FilesService,
  UploadResult,
  HistoryResult,
} from './files.service';
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
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string' },
        originalName: { type: 'string' },
        expiresAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'No file provided or invalid file' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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

  @Delete('/:token')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Delete a file by its token (authenticated)' })
  @ApiParam({ name: 'token', description: 'File token (UUID)', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'File deleted successfully',
    schema: {
      type: 'object',
      properties: {
        originalName: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: file belongs to another user',
  })
  @ApiResponse({ status: 404, description: 'File not found' })
  async delete(
    @Request() req: { user: JwtPayload },
    @Param('token') token: string,
  ): Promise<DeleteResult> {
    return this.filesService.deleteFile(token, req.user.sub);
  }

  @Get('history')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Get files history for authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'List of uploaded files',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              token: { type: 'string' },
              originalName: { type: 'string' },
              mimeType: { type: 'string' },
              size: { type: 'number' },
              expiresAt: { type: 'string', format: 'date-time' },
              createdAt: { type: 'string', format: 'date-time' },
              isExpired: { type: 'boolean' },
            },
          },
        },
      },
    },
  })
  async history(@Request() req: { user: JwtPayload }): Promise<HistoryResult> {
    return this.filesService.history(req.user.sub);
  }

  @Get('download/:token')
  @ApiOperation({ summary: 'Download a file via its public token' })
  @ApiResponse({ status: 200, description: 'File stream' })
  @ApiResponse({ status: 404, description: 'File not found' })
  @ApiResponse({ status: 410, description: 'Link has expired' })
  async download(@Param('token') token: string): Promise<StreamableFile> {
    return this.filesService.download(token);
  }
}
