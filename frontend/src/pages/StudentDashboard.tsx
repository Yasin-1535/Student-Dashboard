import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import { Award, BookOpen, Star } from 'lucide-react';
import type { Marks, Student } from '../types';

const StudentDashboard = () => {
  const [profile, setProfile] = useState<Student | null>(null);
  const [marks, setMarks] = useState<Marks[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/students/me');
        setProfile(res.data);
        const marksRes = await api.get(`/marks/student/${res.data.id}`);
        setMarks(marksRes.data.marks);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, []);

  if (!profile) return <DashboardLayout role="student"><div className="p-4 text-center">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout role="student">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome, {profile.first_name}!</h1>
        <p className="text-gray-600 dark:text-gray-400">Here is your academic overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
            <Award size={32} />
          </div>
          <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-1">{profile.cgpa?.toFixed(2) || 'N/A'}</h3>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Current CGPA</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <BookOpen size={32} />
          </div>
          <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-1">Sem {profile.current_semester}</h3>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Current Semester</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-4">
            <Star size={32} />
          </div>
          <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-1">{marks.length}</h3>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Subjects Completed</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Recent Marks</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Subject</th>
                <th className="pb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Credits</th>
                <th className="pb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Total Marks</th>
                <th className="pb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Grade</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((mark) => (
                <tr key={mark.id} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 text-gray-800 dark:text-white font-medium">{mark.subject?.name}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-300">{mark.subject?.credits}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-300">{mark.total_marks}</td>
                  <td className="py-3">
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-bold dark:bg-gray-700 dark:text-gray-200">
                      {mark.grade}
                    </span>
                  </td>
                </tr>
              ))}
              {marks.length === 0 && (
                <tr><td colSpan={4} className="py-4 text-center text-gray-500">No marks recorded yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
