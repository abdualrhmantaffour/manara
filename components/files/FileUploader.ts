'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function FileUploader({ lessonId, onUpload }: { lessonId: string; onUpload: () => void }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('الملف يجب أن يكون PDF أو صورة');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('lessonId', lessonId);

    try {
      const res = await fetch('/api/files/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error(await res.text());
      toast.success('تم رفع الملف بنجاح');
      onUpload();
    } catch (error: any) {
      toast.error(error.message || 'فشل الرفع');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border-2 border-dashed border-primary/30 rounded-xl p-6 text-center">
      <input type="file" id="file-upload" onChange={handleUpload} accept=".pdf,image/*" className="hidden" />
      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
        <span className="text-4xl">📤</span>
        <span className="text-gray-600">اختر ملفاً للرفع</span>
        <span className="text-sm text-gray-400">PDF، JPG، PNG</span>
      </label>
      {uploading && <p className="mt-2 text-accent animate-pulse">جاري الرفع...</p>}
    </div>
  );
}