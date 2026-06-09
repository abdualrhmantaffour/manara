import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const lessonId = formData.get('lessonId') as string;

  if (!file || !lessonId) {
    return NextResponse.json({ error: 'بيانات ناقصة' }, { status: 400 });
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `lessons/${lessonId}/${fileName}`;

  // رفع إلى Supabase Storage
  const { error: uploadError } = await supabaseAdmin.storage
    .from('files')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  // الحصول على رابط عام
  const { data: urlData } = supabaseAdmin.storage.from('files').getPublicUrl(filePath);

  const fileType = file.type.startsWith('image/') ? 'image' : 'pdf';

  // حفظ البيانات في جدول files
  const { error: dbError } = await supabaseAdmin.from('files').insert({
    lesson_id: lessonId,
    file_name: file.name,
    file_url: urlData.publicUrl,
    file_type: fileType,
    uploader_id: req.headers.get('x-user-id') || '00000000-0000-0000-0000-000000000000', // يمكن تمريره من الجلسة عبر middleware
  });

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, url: urlData.publicUrl });
}
