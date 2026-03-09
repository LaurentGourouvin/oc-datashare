import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const mockAuthService = {
  register: jest.fn().mockResolvedValue({ access_token: 'mock_token' }),
  login: jest.fn().mockResolvedValue({ access_token: 'mock_token' }),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register and return access_token', async () => {
      const result = await controller.register({
        email: 'test@test.com',
        password: 'password123',
      });

      expect(result).toEqual({ access_token: 'mock_token' });
      expect(mockAuthService.register).toHaveBeenCalledWith(
        'test@test.com',
        'password123',
      );
    });
  });

  describe('login', () => {
    it('should call authService.login and return access_token', async () => {
      const result = await controller.login({
        email: 'test@test.com',
        password: 'password123',
      });

      expect(result).toEqual({ access_token: 'mock_token' });
      expect(mockAuthService.login).toHaveBeenCalledWith(
        'test@test.com',
        'password123',
      );
    });
  });
});
