export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'student';
  created_at: string;
}

export interface Student {
  id: number;
  user_id: number;
  enrollment_number: string;
  first_name: string;
  last_name: string;
  department: string;
  batch_year: number;
  current_semester: number;
  cgpa?: number;
}

export interface Subject {
  id: number;
  code: string;
  name: string;
  credits: number;
  semester: number;
  department: string;
}

export interface Marks {
  id: number;
  student_id: number;
  subject_id: number;
  semester: number;
  internal_marks: number;
  external_marks: number;
  total_marks: number;
  grade: string;
  grade_points: number;
  subject?: Subject;
}
