import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Job Tracker',
  description: 'Suivi de candidatures',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <nav className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <span className="font-bold text-xl text-gray-900">Job Tracker</span>
            <div className="flex gap-6">
              <Link href="/dashboard"    className="text-gray-600 hover:text-gray-900 text-sm font-medium">Dashboard</Link>
              <Link href="/applications" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Candidatures</Link>
              <Link href="/kanban"       className="text-gray-600 hover:text-gray-900 text-sm font-medium">Kanban</Link>
            </div>
          </div>
        </nav>
        <main className="max-w-6xl mx-auto px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}