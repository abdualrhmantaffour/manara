'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Subject } from '@/types';

export default function ManageSubjectsClient({ subjects }: { subjects: Subject[] }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const addSubject = async () => {
    if (!name.trim()) return;
    const res = await fetch('/api/subjects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      toast.success('تمت الإضافة');
      router.refresh();
      setName('');
    } else {
      toast.error('خطأ');
    }
  };

  const updateSubject = async (id: string) => {
    const res = await fetch('/api/subjects', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name: editName }),
    });
    if (res.ok) {
      toast.success('تم التعديل');
      setEditingId(null);
      router.refresh();
    }
  };

  const deleteSubject = async (id: string) => {
    if (!confirm('متأكد من الحذف؟')) return;
    const res = await fetch(`/api/subjects?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('تم الحذف');
      router.refresh();
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">إدارة المواد</h1>
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="اسم المادة الجديدة"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border rounded-lg px-4 py-2 flex-1"
        />
        <button onClick={addSubject} className="bg-primary text-white px-6 py-2 rounded-lg">
          إضافة
        </button>
      </div>

      <ul className="space-y-2">
        {subjects.map(s => (
          <li key={s.id} className="flex items-center justify-between border-b py-2">
            {editingId === s.id ? (
              <div className="flex gap-2 flex-1">
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="border rounded px-2 py-1 flex-1"
                />
                <button onClick={() => updateSubject(s.id)} className="text-green-600">حفظ</button>
                <button onClick={() => setEditingId(null)} className="text-gray-500">إلغاء</button>
              </div>
            ) : (
              <>
                <span>{s.name}</span>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setEditingId(s.id); setEditName(s.name); }}
                    className="text-blue-600"
                  >
                    تعديل
                  </button>
                  <button onClick={() => deleteSubject(s.id)} className="text-red-600">
                    حذف
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}