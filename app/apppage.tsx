import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Card from '@/components/ui/Card';
import SearchBar from '@/components/search/SearchBar';
import { Subject, FileItem } from '@/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // جلب المواد
  const { data: subjects } = await supabase.from('subjects').select('*').order('name');

  // جلب آخر الملفات المضافة
  const { data: recentFiles } = await supabase
    .from('files')
    .select('*, lessons(title, units(subject_id, subjects(name)))')
    .order('created_at', { ascending: false })
    .limit(6);

  return (
    <div className="space-y-8">
      <section className="text-center py-8">
        <h1 className="text-4xl font-bold text-primary mb-4">منارة</h1>
        <p className="text-xl text-gray-600 mb-6">منصة تنظيم ومشاركة الدروس المدرسية</p>
        <div className="max-w-md mx-auto">
          <SearchBar />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">المواد الدراسية</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {subjects?.map((s: Subject) => (
            <Link key={s.id} href={`/subjects/${s.id}`}>
              <Card className="hover:bg-primary/5 transition-colors text-center">
                <span className="text-3xl block mb-2">📘</span>
                <span className="font-medium">{s.name}</span>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">آخر الملفات المضافة</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentFiles?.map((file: any) => (
            <Card key={file.id}>
              <div className="flex items-center gap-2">
                <span>{file.file_type === 'pdf' ? '📄' : '🖼️'}</span>
                <div>
                  <p className="font-medium truncate">{file.file_name}</p>
                  <p className="text-sm text-gray-500">
                    {file.lessons?.title} - {file.lessons?.units?.subjects?.name}
                  </p>
                </div>
              </div>
              <Link href={file.file_url} target="_blank" className="text-accent text-sm mt-2 block">
                تحميل
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
