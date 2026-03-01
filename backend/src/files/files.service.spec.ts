import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Readable } from 'stream';

const mockPrismaService = {
  file: {
    create: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
};

const mockFile = (
  overrides: Partial<Express.Multer.File> = {},
): Express.Multer.File =>
  ({
    fieldname: 'file',
    originalname: 'test.pdf',
    encoding: '7bit',
    mimetype: 'application/pdf',
    size: 1024,
    path: '/uploads/user-id/uuid.pdf',
    buffer: Buffer.from(''),
    destination: '/uploads/user-id',
    filename: 'uuid.pdf',
    stream: new Readable(),
    ...overrides,
  }) as Express.Multer.File;

describe('FilesService', () => {
  let service: FilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
    jest.clearAllMocks();
  });

  describe('uploadFile', () => {
    it('should upload a file and return metadata', async () => {
      mockPrismaService.file.create.mockResolvedValue({
        id: 'uuid-123',
        token: 'token-123',
        originalName: 'test.pdf',
        size: 1024,
        expiresAt: new Date(),
        storagePath: '/uploads/user-id/uuid.pdf',
        mimeType: 'application/pdf',
        createdAt: new Date(),
        userId: 'user-123',
        filePassword: null,
      });

      const result = await service.uploadFile(mockFile(), 'user-123');

      expect(result.token).toBe('token-123');
      expect(result.originalName).toBe('test.pdf');
      expect(result).not.toHaveProperty('storagePath');
    });

    it('should throw BadRequestException if file is too large', async () => {
      await expect(
        service.uploadFile(mockFile({ size: 2_000_000_000 }), 'user-123'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for forbidden MIME type', async () => {
      await expect(
        service.uploadFile(
          mockFile({ mimetype: 'application/x-msdownload' }),
          'user-123',
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for forbidden extension', async () => {
      await expect(
        service.uploadFile(mockFile({ originalname: 'virus.exe' }), 'user-123'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should delete a file and return metadata', async () => {
      mockPrismaService.file.findUnique.mockResolvedValue({
        id: 'uuid-123',
        token: 'token-123',
        originalName: 'test.pdf',
        size: 1024,
        storagePath: '/uploads/user-123/uuid.pdf',
        mimeType: 'application/pdf',
        createdAt: new Date(),
        expiresAt: new Date(),
        userId: 'user-123',
        filePassword: null,
      });

      mockPrismaService.file.delete.mockResolvedValue({
        originalName: 'test.pdf',
      });

      const result = await service.deleteFile('token-123', 'user-123');

      expect(result.originalName).toBe('test.pdf');
      expect(mockPrismaService.file.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if file not found', async () => {
      mockPrismaService.file.findUnique.mockResolvedValue(null);

      await expect(service.deleteFile('token-123', 'user-123')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if file belongs to another user', async () => {
      mockPrismaService.file.findUnique.mockResolvedValue({
        id: 'uuid-123',
        token: 'token-123',
        originalName: 'test.pdf',
        size: 1024,
        storagePath: '/uploads/other-user/uuid.pdf',
        mimeType: 'application/pdf',
        createdAt: new Date(),
        expiresAt: new Date(),
        userId: 'other-user',
        filePassword: null,
      });

      await expect(service.deleteFile('token-123', 'user-123')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('resolveExpiry', () => {
    it('should return max expiry (7 days) if no date provided', async () => {
      mockPrismaService.file.create.mockResolvedValue({
        id: 'uuid-123',
        token: 'token-123',
        originalName: 'test.pdf',
        size: 1024,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        storagePath: '/uploads/user-id/uuid.pdf',
        mimeType: 'application/pdf',
        createdAt: new Date(),
        userId: 'user-123',
        filePassword: null,
      });

      const result = await service.uploadFile(mockFile(), 'user-123');
      const diffDays = Math.round(
        (result.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
      );

      expect(diffDays).toBe(7);
    });
  });
});
