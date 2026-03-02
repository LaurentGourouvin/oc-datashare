import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponse } from './auth.service';
import { IsEmail, IsString, MinLength } from 'class-validator';
import {
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'motdepasse123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;
}

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'motdepasse123' })
  @IsString()
  password: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created, returns a JWT access token',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  async register(@Body() dto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(dto.email, dto.password);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in and retrieve a JWT access token' })
  @ApiResponse({
    status: 200,
    description: 'Authentication successful, returns a JWT access token',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(dto.email, dto.password);
  }
}
