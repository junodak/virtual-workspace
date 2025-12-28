import { Controller, Get, Post, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { FolderService } from './folder.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';

@Controller('folders')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Post()
  create(@Body() createFolderDto: CreateFolderDto, @Headers('x-user-id') userId: string) {
    return this.folderService.create(createFolderDto, userId);
  }

  @Get()
  findAll(@Headers('x-user-id') userId: string, @Query('parentId') parentId?: string) {
    return this.folderService.findAll(userId, parentId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Headers('x-user-id') userId: string) {
    return this.folderService.findOne(id, userId);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateFolderDto: UpdateFolderDto,
    @Headers('x-user-id') userId: string,
  ) {
    return this.folderService.update(id, updateFolderDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Headers('x-user-id') userId: string) {
    return this.folderService.remove(id, userId);
  }
}
