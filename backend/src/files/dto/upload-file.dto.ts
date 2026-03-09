import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class UploadFileDto {
  @ApiPropertyOptional({
    description: "Date d'expiration du lien (max 7 jours, défaut : now + 7j)",
    example: '2024-12-31T23:59:59.000Z',
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
