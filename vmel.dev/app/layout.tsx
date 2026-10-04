import type { Metadata, Viewport } from 'next';
import '@fontsource/ibm-plex-mono/latin-400.css';
import './globals.scss';

export const metadata: Metadata = {
  metadataBase: new URL('https://vmel.dev'),
  title: { default: 'Valentyn Melnychenko — Senior Full-stack Developer', template: '%s — vmel.dev' },
  description: 'Senior full-stack developer based in Finland. Content platform migrations, commerce integrations and AI-assisted engineering workflows.',
  openGraph: { type: 'website', url: '/', title: 'Valentyn Melnychenko — Code meets character', images: ['/og-cover.png'] },
  twitter: { card: 'summary_large_image' },
};
export const viewport: Viewport = { themeColor: '#090909' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
