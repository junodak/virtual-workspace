'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setToken } = useAuth();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const token = searchParams.get('token');
    if (token) {
      setToken(token);
      router.replace('/');
    } else {
      router.replace('/login');
    }
  }, [searchParams, setToken, router]);

  return <p>Logging in...</p>;
}

export default function AuthCallbackPage() {
  return (
    <main className="auth-container">
      <Suspense fallback={<p>Loading...</p>}>
        <CallbackHandler />
      </Suspense>
    </main>
  );
}
