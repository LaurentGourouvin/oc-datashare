import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { BadRequestException } from '@nestjs/common';
import { Readable } from 'stream';

const mockFilesService = {
  uploadFile: jest.fn(),
  deleteFile: jest.fn(),
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

const mockUser = { sub: 'user-123', email: 'test@test.com' };

describe('FilesController', () => {
  let controller: FilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [{ provide: FilesService, useValue: mockFilesService }],
    }).compile();

    controller = module.get<FilesController>(FilesController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('upload', () => {
    it('should call filesService.uploadFile and return result', async () => {
      mockFilesService.uploadFile.mockResolvedValue({
        token: 'token-123',
        originalName: 'test.pdf',
        size: 1024,
        expiresAt: new Date(),
      });

      const result = await controller.upload(
        mockFile(),
        { expiresAt: undefined },
        { user: mockUser },
      );

      expect(result.token).toBe('token-123');
      expect(mockFilesService.uploadFile).toHaveBeenCalledWith(
        expect.any(Object),
        'user-123',
        undefined,
      );
    });

    it('should throw BadRequestException if no file provided', async () => {
      await expect(
        controller.upload(
          undefined as unknown as Express.Multer.File,
          { expiresAt: undefined },
          { user: mockUser },
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete', () => {
    it('should call filesService.deleteFile and return result', async () => {
      mockFilesService.deleteFile = jest.fn().mockResolvedValue({
        originalName: 'test.pdf',
      });

      const result = await controller.delete({ user: mockUser }, 'token-123');

      expect(result.originalName).toBe('test.pdf');
      expect(mockFilesService.deleteFile).toHaveBeenCalledWith(
        'token-123',
        'user-123',
      );
    });
  });
});
