import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Folder } from '../entities/folder.entity';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';

@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(Folder)
    private folderRepository: Repository<Folder>,
  ) {}

  async create(createFolderDto: CreateFolderDto, ownerId: string): Promise<Folder> {
    let path = `/${createFolderDto.name}`;

    if (createFolderDto.parentId) {
      const parent = await this.folderRepository.findOne({
        where: { id: createFolderDto.parentId, ownerId },
      });
      if (!parent) {
        throw new NotFoundException('Parent folder not found');
      }
      path = `${parent.path}/${createFolderDto.name}`;
    }

    const folder = this.folderRepository.create({
      ...createFolderDto,
      ownerId,
      path,
    });

    return this.folderRepository.save(folder);
  }

  async findAll(ownerId: string, parentId?: string): Promise<Folder[]> {
    return this.folderRepository.find({
      where: {
        ownerId,
        parentId: parentId ?? IsNull(),
      },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string, ownerId: string): Promise<Folder> {
    const folder = await this.folderRepository.findOne({
      where: { id, ownerId },
    });
    if (!folder) {
      throw new NotFoundException('Folder not found');
    }
    return folder;
  }

  async update(id: string, updateFolderDto: UpdateFolderDto, ownerId: string): Promise<Folder> {
    const folder = await this.findOne(id, ownerId);

    if (updateFolderDto.name) {
      const parentPath = folder.path.substring(0, folder.path.lastIndexOf('/'));
      folder.path = `${parentPath}/${updateFolderDto.name}`;
      folder.name = updateFolderDto.name;
    }

    return this.folderRepository.save(folder);
  }

  async remove(id: string, ownerId: string): Promise<void> {
    const folder = await this.findOne(id, ownerId);
    await this.folderRepository.remove(folder);
  }
}
