import { IsString, IsOptional, IsUUID, IsNumber } from 'class-validator';

export class CreateFileDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  mimeType?: string;

  @IsOptional()
  @IsNumber()
  size?: number;

  @IsString()
  objectKey: string;

  @IsOptional()
  @IsUUID()
  folderId?: string;
}
