import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import PDFViewer from '@/components/files/PDFViewer';
import { Lesson, FileItem } from '@/types';

export default async function LessonPage({ params }: { params: { id: string } }) {
  const { data: lesson } = await supabase
    .from('lessons')
    .select('*, units(subject_id, title, subjects(name))')
    .eq('id', params.id)
    .single();

  if (!lesson) notFound();

  const { data: files } = await supabase
    .from('files')
    .select('*')
    .eq('lesson_id', params.id)
    .order('created_at');

  const subjectName = (lesson.units as any)?.subjects?.name;
  const unitTitle = (lesson.units as any)?.title;

  return (
    <div>
      <Link href={`/subjects/${(lesson.units as any)?.subject_id}`} className="text-primary hover:underline">
        ← {subjectName} - {unitTitle}
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-6">{lesson.title}</h1>

      {files && files.length > 0 ? (
        <div className="grid gap-6">
          {files.map((file: FileItem) => (
            <div key={file.id} className="bg-white rounded-xl shadow p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{file.file_type === 'pdf' ? '📄' : '🖼️'}</span>
                  <span className="font-medium">{file.file_name}</span>
                </div>
                <a
                  href={file.file_url}
                  download
                  className="bg-accent text-white px-4 py-1 rounded-lg hover:bg-orange-600"
                >
                  تحميل
                </a>
              </div>
              {file.file_type === 'pdf' && (
                <div className="border rounded-lg overflow-hidden">
                  <PDFViewer url={file.file_url} />
                </div>
              )}
              {file.file_type === 'image' && (
                <img src={file.file_url} alt={file.file_name} className="max-h-96 mx-auto rounded" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">لا توجد ملفات لهذا الدرس بعد.</p>
      )}
    </div>
  );
}