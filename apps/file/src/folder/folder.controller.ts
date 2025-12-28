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
import { FolderService } from './folder.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('folders')
@UseGuards(JwtAuthGuard)
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Post()
  create(@Body() createFolderDto: CreateFolderDto, @Request() req) {
    return this.folderService.create(createFolderDto, req.user.id);
  }

  @Get()
  findAll(@Request() req, @Query('parentId') parentId?: string) {
    return this.folderService.findAll(req.user.id, parentId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.folderService.findOne(id, req.user.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateFolderDto: UpdateFolderDto, @Request() req) {
    return this.folderService.update(id, updateFolderDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.folderService.remove(id, req.user.id);
  }
}
