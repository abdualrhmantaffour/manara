import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // حماية لوحة التحكم
    if (path.startsWith('/dashboard')) {
      if (!token) return NextResponse.redirect(new URL('/login', req.url));
      if (path.startsWith('/dashboard/users') && token.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      if (['/dashboard/subjects', '/dashboard/lessons', '/dashboard/files'].some(p => path.startsWith(p))) {
        if (token.role === 'student') {
          return NextResponse.redirect(new URL('/', req.url));
        }
      }
    }

    // حماية مسارات API للوحة التحكم
    if (path.startsWith('/api/')) {
      if (path.startsWith('/api/auth')) return NextResponse.next();
      if (!token) {
        return new NextResponse(JSON.stringify({ error: 'غير مصرح' }), { status: 401 });
      }
      // المزيد من التحقق داخل كل API
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => true, // السماح بكل الطلبات ثم الفلترة يدوياً
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};