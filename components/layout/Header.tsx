'use client';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import SearchBar from '@/components/search/SearchBar';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold">📚 منارة</span>
        </Link>

        <div className="hidden md:flex flex-1 max-w-lg mx-8">
          <SearchBar />
        </div>

        <nav className="flex items-center gap-4">
          {session ? (
            <>
              <span>{session.user.name}</span>
              {(session.user.role === 'admin' || session.user.role === 'teacher') && (
                <Link href="/dashboard" className="hover:text-accent">
                  لوحة التحكم
                </Link>
              )}
              <button onClick={() => signOut()} className="hover:text-accent">
                خروج
              </button>
            </>
          ) : (
            <Link href="/login" className="hover:text-accent">
              تسجيل الدخول
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
