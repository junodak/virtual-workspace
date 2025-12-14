'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { api, AppInfo } from '@/lib/api';
import {
  HomeIcon,
  FolderIcon,
  FileTextIcon,
  PresentationIcon,
  TableIcon,
  ImageIcon,
  GlobeIcon,
  MailIcon,
  DatabaseIcon,
  MessageIcon,
  SettingsIcon,
  LogOutIcon,
  MenuIcon,
} from './icons';

const ICONS: Record<string, () => JSX.Element> = {
  folder: FolderIcon,
  'file-text': FileTextIcon,
  presentation: PresentationIcon,
  table: TableIcon,
  image: ImageIcon,
  globe: GlobeIcon,
  mail: MailIcon,
  database: DatabaseIcon,
  'message-circle': MessageIcon,
};

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const router = useRouter();
  const { user, token, logout } = useAuth();
  const [apps, setApps] = useState<AppInfo[]>([]);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) return;
    api.getApps(token).then(({ data }) => {
      if (data) setApps(data);
    });
  }, [token]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setShowAccountMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!token) return null;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.[0].toUpperCase() || '?';

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
      <div className="sidebar-header">
        {isOpen && (
          <Link href="/" className="sidebar-logo">
            W
          </Link>
        )}
        <button
          className="sidebar-toggle"
          onClick={onToggle}
          title={isOpen ? 'Collapse' : 'Expand'}
        >
          <MenuIcon />
        </button>
      </div>

      <nav className="sidebar-nav">
        <Link href="/" className="sidebar-item" title="Home">
          <span className="sidebar-icon">
            <HomeIcon />
          </span>
          {isOpen && <span className="sidebar-label">Home</span>}
        </Link>

        <div className="sidebar-divider" />

        {isOpen && <div className="sidebar-section-label">APPLICATIONS</div>}

        {apps.map((app) => {
          const IconComponent = ICONS[app.icon] || FolderIcon;
          return (
            <Link key={app.id} href={app.path} className="sidebar-item" title={app.description}>
              <span className="sidebar-icon">
                <IconComponent />
              </span>
              {isOpen && <span className="sidebar-label">{app.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer" ref={accountMenuRef}>
        <button
          className="sidebar-account"
          onClick={() => setShowAccountMenu(!showAccountMenu)}
          title="Account"
        >
          <span className="account-avatar">{userInitials}</span>
          {isOpen && <span className="sidebar-label">Account</span>}
        </button>

        {showAccountMenu && (
          <div className="account-menu">
            <div className="account-menu-header">
              <span className="account-avatar">{userInitials}</span>
              <div className="account-info">
                <span className="account-name">{user?.name || 'User'}</span>
                <span className="account-email">{user?.email}</span>
              </div>
            </div>
            <div className="account-menu-divider" />
            <Link
              href="/settings"
              className="account-menu-item"
              onClick={() => setShowAccountMenu(false)}
            >
              <SettingsIcon />
              <span>Settings</span>
            </Link>
            <button className="account-menu-item" onClick={handleLogout}>
              <LogOutIcon />
              <span>Log out</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
