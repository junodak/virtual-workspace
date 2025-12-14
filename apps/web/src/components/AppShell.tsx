'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { Sidebar } from './Sidebar';
import { ChatPanel, ChatButton } from './ChatPanel';

const SIDEBAR_OPEN = 240;
const SIDEBAR_COLLAPSED = 56;

function usePersistedState<T>(key: string, defaultValue: T): [T, (value: T) => void, boolean] {
  const [state, setState] = useState<T>(defaultValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored !== null) {
      setState(JSON.parse(stored));
    }
    setIsHydrated(true);
  }, [key]);

  const setPersistedState = (value: T) => {
    setState(value);
    localStorage.setItem(key, JSON.stringify(value));
  };

  return [state, setPersistedState, isHydrated];
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatOpen, setChatOpen, chatHydrated] = usePersistedState('chat-open', false);
  const [chatWidth, setChatWidth, widthHydrated] = usePersistedState('chat-width', 380);

  const isHydrated = chatHydrated && widthHydrated;

  if (isLoading || !isHydrated) {
    return <div className="app-loading">Loading...</div>;
  }

  if (!user) {
    return <>{children}</>;
  }

  const sidebarWidth = sidebarOpen ? SIDEBAR_OPEN : SIDEBAR_COLLAPSED;
  const maxMargin = `calc(100vw - ${sidebarWidth}px)`;
  const contentStyle = chatOpen ? { marginRight: `min(${chatWidth}px, ${maxMargin})` } : undefined;

  const contentClass = ['app-content', !sidebarOpen && 'sidebar-collapsed']
    .filter(Boolean)
    .join(' ');

  return (
    <div className="app-shell">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className={contentClass} style={contentStyle}>
        {children}
      </div>
      {!chatOpen && <ChatButton onClick={() => setChatOpen(true)} />}
      <ChatPanel
        isOpen={chatOpen}
        width={chatWidth}
        sidebarWidth={sidebarWidth}
        onWidthChange={setChatWidth}
        onClose={() => setChatOpen(false)}
      />
    </div>
  );
}
