import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import ManageSubjectsClient from './ManageSubjectsClient';

export default async function ManageSubjectsPage() {
  const session = await getServerSession();
  if (!session || session.user.role === 'student') redirect('/login');

  const { data: subjects } = await supabaseAdmin.from('subjects').select('*').order('name');

  return <ManageSubjectsClient subjects={subjects || []} />;
}