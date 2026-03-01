import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as path from 'path';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs/promises';

const FORBIDDEN_MIME_TYPES = [
  'application/x-msdownload',
  'application/x-sh',
  'application/x-bat',
];

const FORBIDDEN_EXTENSIONS = ['.exe', '.bat', '.sh', '.cmd'];

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE ?? '1073741824', 10);

export interface UploadResult {
  token: string;
  expiresAt: Date;
  originalName: string;
  size: number;
}

export interface DeleteResult {
  originalName: string;
}

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Valide le fichier, le persiste en base et retourne les métadonnées publiques.
   */
  async uploadFile(
    file: Express.Multer.File,
    userId: string,
    expiresAt?: string,
  ): Promise<UploadResult> {
    this.validateFile(file);

    const expiry = this.resolveExpiry(expiresAt);

    const record = await this.prisma.file.create({
      data: {
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        storagePath: file.path,
        expiresAt: expiry,
        userId,
      },
    });

    this.logger.log(`File uploaded: id=${record.id} userId=${userId}`);

    return {
      token: record.token,
      expiresAt: record.expiresAt,
      originalName: record.originalName,
      size: record.size,
    };
  }

  async deleteFile(tokenUuid: string, userId: string): Promise<DeleteResult> {
    const file = await this.prisma.file.findUnique({
      where: { token: tokenUuid },
    });

    if (!file) {
      throw new NotFoundException('File not found.');
    }

    if (file.userId !== userId) {
      throw new ForbiddenException('Not authorized.');
    }

    await this.prisma.file.delete({
      where: { token: tokenUuid },
    });

    try {
      await fs.unlink(file.storagePath);
    } catch {
      this.logger.warn(`File not found on the server: ${file.storagePath}`);
    }

    return {
      originalName: file.originalName,
    };
  }

  /**
   * Valide le type MIME, l'extension et la taille du fichier.
   * Lève une BadRequestException en cas de violation.
   */
  private validateFile(file: Express.Multer.File): void {
    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(
        'File size exceeds the maximum allowed size (1GB).',
      );
    }

    if (FORBIDDEN_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('File type not allowed');
    }

    const ext = path.extname(file.originalname).toLowerCase();
    if (FORBIDDEN_EXTENSIONS.includes(ext)) {
      throw new BadRequestException('File type not allowed');
    }
  }

  /**
   * Calcule la date d'expiration.
   * Plafonne à now + 7 jours si la date demandée dépasse ce seuil.
   */
  private resolveExpiry(expiresAt?: string): Date {
    const maxExpiry = new Date();
    maxExpiry.setDate(maxExpiry.getDate() + 7);

    const minExpiry = new Date();
    minExpiry.setDate(minExpiry.getDate() + 1);

    if (!expiresAt) {
      return maxExpiry;
    }

    const requested = new Date(expiresAt);

    if (isNaN(requested.getTime())) {
      return maxExpiry;
    }

    if (requested < minExpiry) return minExpiry;
    if (requested > maxExpiry) return maxExpiry;

    return requested;
  }
}
