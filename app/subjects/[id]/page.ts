import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import { Subject, Unit, Lesson } from '@/types';

export default async function SubjectPage({ params }: { params: { id: string } }) {
  const { data: subject } = await supabase.from('subjects').select('*').eq('id', params.id).single();
  if (!subject) notFound();

  const { data: units } = await supabase
    .from('units')
    .select('*, lessons(*)')
    .eq('subject_id', params.id)
    .order('order_index');

  return (
    <div>
      <Link href="/" className="text-primary hover:underline mb-4 block">← العودة للرئيسية</Link>
      <h1 className="text-3xl font-bold mb-6">{subject.name}</h1>

      {units?.map((unit: any) => (
        <div key={unit.id} className="mb-8">
          <h2 className="text-xl font-semibold mb-3 border-b pb-2">{unit.title}</h2>
          <div className="grid gap-3">
            {unit.lessons?.map((lesson: Lesson) => (
              <Link key={lesson.id} href={`/lessons/${lesson.id}`}>
                <Card className="flex items-center gap-3 hover:bg-gray-50">
                  <span className="text-2xl">📖</span>
                  <span className="font-medium">{lesson.title}</span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}