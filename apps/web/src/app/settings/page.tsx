'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';

export default function SettingsPage() {
  const router = useRouter();
  const { user, token, isLoading: authLoading } = useAuth();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setError('');
    setMessage('');
    setIsLoading(true);

    const updateData: { name?: string; password?: string } = {};
    if (name !== (user?.name || '')) {
      updateData.name = name;
    }
    if (password) {
      updateData.password = password;
    }

    if (Object.keys(updateData).length === 0) {
      setMessage('No changes to save');
      setIsLoading(false);
      return;
    }

    const { error: err } = await api.updateProfile(token, updateData);
    if (err) {
      setError(err);
    } else {
      setMessage('Profile updated');
      setPassword('');
    }
    setIsLoading(false);
  };

  if (authLoading || !user) {
    return (
      <main className="auth-container">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="auth-container">
      <div className="auth-box">
        <h1>Settings</h1>
        <form onSubmit={handleSubmit}>
          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={user.email} disabled />
          </div>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              placeholder="Leave blank to keep current"
            />
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
        <p className="link">
          <Link href="/">Back to Home</Link>
        </p>
      </div>
    </main>
  );
}
