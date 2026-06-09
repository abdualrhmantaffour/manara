import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Card from '@/components/ui/Card';

export default async function SearchPage({ searchParams }: { searchParams: { q: string } }) {
  const query = searchParams.q || '';
  if (!query) return <p>الرجاء إدخال كلمة للبحث.</p>;

  // بحث في الملفات والدروس والمواد
  const { data: lessons } = await supabase
    .from('lessons')
    .select('*, units(subject_id, title, subjects(name))')
    .ilike('title', `%${query}%`)
    .limit(10);

  const { data: subjects } = await supabase
    .from('subjects')
    .select('*')
    .ilike('name', `%${query}%`)
    .limit(5);

  const { data: files } = await supabase
    .from('files')
    .select('*, lessons(title, units(subject_id, subjects(name)))')
    .ilike('file_name', `%${query}%`)
    .limit(10);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">نتائج البحث عن: "{query}"</h1>

      {subjects?.length ? (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">المواد</h2>
          {subjects.map(s => (
            <Link key={s.id} href={`/subjects/${s.id}`} className="block p-2 hover:bg-gray-100 rounded">
              {s.name}
            </Link>
          ))}
        </section>
      ) : null}

      {lessons?.length ? (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">الدروس</h2>
          {lessons.map((l: any) => (
            <Link key={l.id} href={`/lessons/${l.id}`} className="block p-2 hover:bg-gray-100 rounded">
              {l.title} - {l.units?.subjects?.name}
            </Link>
          ))}
        </section>
      ) : null}

      {files?.length ? (
        <section>
          <h2 className="text-xl font-semibold mb-2">الملفات</h2>
          {files.map((f: any) => (
            <Card key={f.id} className="flex justify-between mb-2">
              <span>{f.file_name} ({f.lessons?.title})</span>
              <a href={f.file_url} download className="text-accent">تحميل</a>
            </Card>
          ))}
        </section>
      ) : null}

      {!subjects?.length && !lessons?.length && !files?.length && (
        <p className="text-gray-500">لا توجد نتائج.</p>
      )}
    </div>
  );
}
