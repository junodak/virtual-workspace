import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AppInfoDto } from './dto/app-info.dto';

const AVAILABLE_APPS: AppInfoDto[] = [
  { id: 'file', name: 'Files', icon: 'folder', path: '/app/file', description: 'File manager' },
  {
    id: 'doc',
    name: 'Documents',
    icon: 'file-text',
    path: '/app/doc',
    description: 'Document editor',
  },
  {
    id: 'slide',
    name: 'Slides',
    icon: 'presentation',
    path: '/app/slide',
    description: 'Presentation editor',
  },
  {
    id: 'sheet',
    name: 'Sheets',
    icon: 'table',
    path: '/app/sheet',
    description: 'Spreadsheet editor',
  },
  {
    id: 'gallery',
    name: 'Gallery',
    icon: 'image',
    path: '/app/gallery',
    description: 'Image gallery',
  },
  {
    id: 'browser',
    name: 'Browser',
    icon: 'globe',
    path: '/app/browser',
    description: 'Web browser',
  },
  { id: 'mail', name: 'Mail', icon: 'mail', path: '/app/mail', description: 'Email client' },
  {
    id: 'db',
    name: 'Database',
    icon: 'database',
    path: '/app/db',
    description: 'Database manager',
  },
  { id: 'chat', name: 'Chat', icon: 'message-circle', path: '/app/chat', description: 'AI chat' },
];

@Controller('apps')
export class AppsController {
  @Get()
  @UseGuards(JwtAuthGuard)
  getApps(): AppInfoDto[] {
    return AVAILABLE_APPS;
  }
}
