'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';

export default function Home() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <main>
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Virtual Workspace</h1>
      <p style={{ color: '#666' }}>AI-powered virtual workspace</p>
      {user ? (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p>{user.name || user.email}</p>
          <button
            onClick={logout}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: '#262a33',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div style={{ marginTop: '2rem', display: 'flex', gap: '0.5rem' }}>
          <Link
            href="/login"
            style={{
              padding: '0.5rem 1rem',
              background: '#262a33',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '4px',
            }}
          >
            Login
          </Link>
          <Link
            href="/register"
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #ddd',
              color: '#262a33',
              textDecoration: 'none',
              borderRadius: '4px',
            }}
          >
            Register
          </Link>
        </div>
      )}
    </main>
  );
}
