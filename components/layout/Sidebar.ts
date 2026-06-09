'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

const links = [
  { href: '/dashboard/subjects', label: 'المواد', icon: '📘', roles: ['admin', 'teacher'] },
  { href: '/dashboard/lessons', label: 'الدروس', icon: '📖', roles: ['admin', 'teacher'] },
  { href: '/dashboard/files', label: 'الملفات', icon: '📁', roles: ['admin', 'teacher'] },
  { href: '/dashboard/users', label: 'المستخدمين', icon: '👥', roles: ['admin'] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="w-64 bg-gray-50 min-h-screen p-4 border-l">
      <h2 className="text-lg font-bold mb-6">لوحة التحكم</h2>
      <nav className="space-y-2">
        {links
          .filter(link => link.roles.includes(session?.user.role || ''))
          .map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                pathname.startsWith(link.href)
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-200'
              }`}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
      </nav>
    </aside>
  );
}