'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageIcon } from './icons';

interface ChatPanelProps {
  isOpen: boolean;
  width: number;
  sidebarWidth: number;
  onWidthChange: (width: number) => void;
  onClose: () => void;
}

export function ChatPanel({ isOpen, width, sidebarWidth, onWidthChange, onClose }: ChatPanelProps) {
  const [message, setMessage] = useState('');
  const isResizing = useRef(false);
  const propsRef = useRef({ onWidthChange, sidebarWidth });

  useEffect(() => {
    propsRef.current = { onWidthChange, sidebarWidth };
  }, [onWidthChange, sidebarWidth]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      const newWidth = window.innerWidth - e.clientX;
      const maxWidth = window.innerWidth - propsRef.current.sidebarWidth;
      propsRef.current.onWidthChange(Math.min(Math.max(newWidth, 280), maxWidth));
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  };

  if (!isOpen) return null;

  return (
    <aside className="chat-panel" style={{ width }}>
      <div className="chat-resize" onMouseDown={handleMouseDown} />
      <div className="chat-header">
        <h2>Chat</h2>
        <button className="chat-close" onClick={onClose}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div className="chat-messages">
        <div className="chat-empty">
          <MessageIcon />
          <p>Start a conversation</p>
        </div>
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="button" disabled={!message.trim()}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </aside>
  );
}

export function ChatButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="chat-button" onClick={onClick} title="Chat">
      <MessageIcon />
    </button>
  );
}
