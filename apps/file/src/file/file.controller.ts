import { Controller, Get, Post, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  create(@Body() createFileDto: CreateFileDto, @Headers('x-user-id') userId: string) {
    return this.fileService.create(createFileDto, userId);
  }

  @Get()
  findAll(@Headers('x-user-id') userId: string, @Query('folderId') folderId?: string) {
    return this.fileService.findAll(userId, folderId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Headers('x-user-id') userId: string) {
    return this.fileService.findOne(id, userId);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateFileDto: UpdateFileDto,
    @Headers('x-user-id') userId: string,
  ) {
    return this.fileService.update(id, updateFileDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Headers('x-user-id') userId: string) {
    return this.fileService.remove(id, userId);
  }
}
