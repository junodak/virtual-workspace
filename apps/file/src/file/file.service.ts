import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { File } from '../entities/file.entity';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}

  async create(createFileDto: CreateFileDto, ownerId: string): Promise<File> {
    const file = this.fileRepository.create({
      ...createFileDto,
      ownerId,
    });
    return this.fileRepository.save(file);
  }

  async findAll(ownerId: string, folderId?: string): Promise<File[]> {
    return this.fileRepository.find({
      where: {
        ownerId,
        folderId: folderId ?? IsNull(),
      },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string, ownerId: string): Promise<File> {
    const file = await this.fileRepository.findOne({
      where: { id, ownerId },
    });
    if (!file) {
      throw new NotFoundException('File not found');
    }
    return file;
  }

  async update(id: string, updateFileDto: UpdateFileDto, ownerId: string): Promise<File> {
    const file = await this.findOne(id, ownerId);
    Object.assign(file, updateFileDto);
    return this.fileRepository.save(file);
  }

  async remove(id: string, ownerId: string): Promise<void> {
    const file = await this.findOne(id, ownerId);
    await this.fileRepository.remove(file);
  }
}
