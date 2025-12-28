import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Folder } from './folder.entity';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  mimeType: string;

  @Column({ type: 'bigint', default: 0 })
  size: number;

  @Column()
  objectKey: string; // MinIO object key

  @Column({ nullable: true })
  folderId: string;

  @ManyToOne(() => Folder, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'folderId' })
  folder: Folder;

  @Column()
  ownerId: string; // User UUID from core service

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
