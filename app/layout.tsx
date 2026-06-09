import '@/styles/globals.css';
import Providers from './providers';
import Header from '@/components/layout/Header';

export const metadata = {
  title: 'منارة - منصة الدروس',
  description: 'منصة تعليمية لمشاركة الملفات',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="font-sans bg-gray-50 text-gray-900">
        <Providers>
          <Header />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
