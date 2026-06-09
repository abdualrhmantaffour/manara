import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function DashboardHome() {
  const session = await getServerSession();
  if (!session) redirect('/login');

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">لوحة التحكم</h1>
      <p>مرحباً {session.user.name}، اختر قسماً من القائمة الجانبية.</p>
    </div>
  );
}
