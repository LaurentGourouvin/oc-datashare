import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import { PrismaService } from '../prisma/prisma.service';

const FORBIDDEN_MIME_TYPES = [
  'application/x-msdownload',
  'application/x-sh',
  'application/x-bat',
];

const FORBIDDEN_EXTENSIONS = ['.exe', '.bat', '.sh', '.cmd'];

const MAX_FILE_SIZE = 1_073_741_824; // 1 Go

export interface UploadResult {
  token: string;
  expiresAt: Date;
  originalName: string;
  size: number;
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

    this.logger.log(`Fichier uploadé : id=${record.id} userId=${userId}`);

    return {
      token: record.token,
      expiresAt: record.expiresAt,
      originalName: record.originalName,
      size: record.size,
    };
  }

  /**
   * Valide le type MIME, l'extension et la taille du fichier.
   * Lève une BadRequestException en cas de violation.
   */
  private validateFile(file: Express.Multer.File): void {
    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(
        'Le fichier dépasse la taille maximale autorisée (1 Go).',
      );
    }

    if (FORBIDDEN_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `Type MIME interdit : ${file.mimetype}`,
      );
    }

    const ext = path.extname(file.originalname).toLowerCase();
    if (FORBIDDEN_EXTENSIONS.includes(ext)) {
      throw new BadRequestException(
        `Extension de fichier interdite : ${ext}`,
      );
    }
  }

  /**
   * Calcule la date d'expiration.
   * Plafonne à now + 7 jours si la date demandée dépasse ce seuil.
   */
  private resolveExpiry(expiresAt?: string): Date {
    const maxExpiry = new Date();
    maxExpiry.setDate(maxExpiry.getDate() + 7);

    if (!expiresAt) {
      return maxExpiry;
    }

    const requested = new Date(expiresAt);
    return requested > maxExpiry ? maxExpiry : requested;
  }
}