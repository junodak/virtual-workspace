import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  create(@Body() createFileDto: CreateFileDto, @Request() req) {
    return this.fileService.create(createFileDto, req.user.id);
  }

  @Get()
  findAll(@Request() req, @Query('folderId') folderId?: string) {
    return this.fileService.findAll(req.user.id, folderId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.fileService.findOne(id, req.user.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto, @Request() req) {
    return this.fileService.update(id, updateFileDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.fileService.remove(id, req.user.id);
  }
}
