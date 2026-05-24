import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import type { Student, Subject } from '../types';

const ManageMarks = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    student_id: '',
    subject_id: '',
    semester: 1,
    internal_marks: 0,
    external_marks: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, subjectsRes] = await Promise.all([
          api.get('/students'),
          api.get('/subjects')
        ]);
        setStudents(studentsRes.data);
        setSubjects(subjectsRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      await api.post('/marks/', {
        ...formData,
        student_id: parseInt(formData.student_id),
        subject_id: parseInt(formData.subject_id),
        semester: parseInt(formData.semester as any),
        internal_marks: parseFloat(formData.internal_marks as any),
        external_marks: parseFloat(formData.external_marks as any),
      });
      setSuccess('Marks added successfully!');
      setFormData({
        student_id: '',
        subject_id: '',
        semester: 1,
        internal_marks: 0,
        external_marks: 0,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add marks');
    }
    setLoading(false);
  };

  return (
    <DashboardLayout role="admin">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manage Marks</h1>
        <p className="text-gray-600 dark:text-gray-400">Add or update student marks</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm max-w-2xl overflow-hidden p-6">
        {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">{success}</div>}
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Student</label>
            <select 
              name="student_id" 
              value={formData.student_id} 
              onChange={handleChange} 
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">-- Select Student --</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.enrollment_number} - {s.first_name} {s.last_name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
            <select 
              name="subject_id" 
              value={formData.subject_id} 
              onChange={handleChange} 
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">-- Select Subject --</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Semester</label>
              <input 
                type="number" 
                name="semester" 
                min="1" 
                max="8"
                value={formData.semester} 
                onChange={handleChange} 
                required 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Internal Marks</label>
              <input 
                type="number" 
                name="internal_marks" 
                min="0"
                value={formData.internal_marks} 
                onChange={handleChange} 
                required 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">External Marks</label>
              <input 
                type="number" 
                name="external_marks" 
                min="0"
                value={formData.external_marks} 
                onChange={handleChange} 
                required 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="mt-6 w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Marks'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ManageMarks;
