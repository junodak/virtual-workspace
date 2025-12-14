'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/lib/auth';

export default function Home() {
  const { user, login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const err = isRegister
      ? await register(email, password, name || undefined)
      : await login(email, password);

    if (err) {
      setError(err);
      setIsLoading(false);
    }
  };

  if (user) {
    return (
      <main>
        <h1>Virtual Workspace</h1>
        <p style={{ color: '#666' }}>AI-powered virtual workspace</p>
      </main>
    );
  }

  return (
    <main className="landing-container">
      <div className="landing-hero">
        <h1>Virtual Workspace</h1>
        <p>AI-powered virtual workspace</p>
      </div>
      <div className="auth-box">
        <a
          href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/core/auth/google`}
          className="google-btn"
        >
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </a>
        <div className="divider">or</div>
        <form onSubmit={handleSubmit}>
          {error && <p className="error">{error}</p>}
          {isRegister && (
            <div className="form-group">
              <label htmlFor="name">Name (optional)</label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            {isRegister && <small>Minimum 8 characters</small>}
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Loading...' : isRegister ? 'Register' : 'Login'}
          </button>
        </form>
        <p className="link">
          {isRegister ? (
            <>
              Already have an account?{' '}
              <button type="button" onClick={() => setIsRegister(false)}>
                Login
              </button>
            </>
          ) : (
            <>
              Don&apos;t have an account?{' '}
              <button type="button" onClick={() => setIsRegister(true)}>
                Register
              </button>
            </>
          )}
        </p>
      </div>
    </main>
  );
}
