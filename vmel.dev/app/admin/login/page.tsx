import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminSession } from '../../../src/lib/admin';
import LoginForm from '../../../src/components/LoginForm';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Owner sign in', robots: { index: false, follow: false } };

export default async function LoginPage() {
  if (await getAdminSession()) redirect('/admin');
  return <main className="admin-shell admin-login">
    <Link href="/" className="text-link">← Back to portfolio</Link>
    <p className="mono admin-eyebrow">VMEL / OWNER WORKSPACE</p>
    <h1>Welcome back.</h1><p className="admin-intro">Sign in to organize and publish your work.</p>
    <LoginForm />
  </main>;
}
