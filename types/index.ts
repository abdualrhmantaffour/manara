export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Subject {
  id: string;
  name: string;
  created_at: string;
}

export interface Unit {
  id: string;
  subject_id: string;
  title: string;
  order_index: number;
  created_at: string;
}

export interface Lesson {
  id: string;
  unit_id: string;
  title: string;
  order_index: number;
  created_at: string;
}

export interface FileItem {
  id: string;
  lesson_id: string;
  file_name: string;
  file_url: string;
  file_type: 'pdf' | 'image';
  uploader_id: string;
  download_count: number;
  created_at: string;
}