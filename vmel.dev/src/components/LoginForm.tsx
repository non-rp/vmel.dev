'use client';

import { useState } from 'react';
import { createAuthClient } from 'better-auth/react';
import { useRouter } from 'next/navigation';

const authClient = createAuthClient();

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true); setError('');
    try {
      const result = await authClient.signIn.email({ email: String(data.get('email')), password: String(data.get('password')) });
      if (result.error) setError('Unable to sign in. Check your details and try again.');
      else { router.replace('/admin'); router.refresh(); }
    } catch { setError('Unable to reach the server. Try again.'); }
    finally { setBusy(false); }
  }

  return <form onSubmit={submit} className="admin-form">
    <label>Email<input type="email" name="email" autoComplete="username" required /></label>
    <label>Password<input type="password" name="password" autoComplete="current-password" required /></label>
    <p role="alert" className="admin-error">{error}</p>
    <button disabled={busy} className="admin-button">{busy ? 'Signing in…' : 'Sign in'}</button>
  </form>;
}
