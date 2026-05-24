import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import type { Student, Subject } from '../types';
import { Search, Plus, X, Trash2, BookOpen } from 'lucide-react';

const StudentsList = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    enrollment_number: '',
    department: '',
    batch_year: 2024,
    current_semester: 1
  });

  // Dynamic marks entry within the student modal
  const [addedMarks, setAddedMarks] = useState<{
    subject_id: number;
    semester: number;
    internal_marks: number;
    external_marks: number;
  }[]>([]);

  const [markForm, setMarkForm] = useState({
    subject_id: '',
    semester: 1,
    internal_marks: '',
    external_marks: ''
  });

  const fetchData = async () => {
    try {
      const [studentsRes, subjectsRes] = await Promise.all([
        api.get('/students'),
        api.get('/subjects')
      ]);
      setStudents(studentsRes.data);
      setSubjects(subjectsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    const payload = {
      ...formData,
      role: 'student',
      username: `student_${formData.enrollment_number.toLowerCase()}_${Date.now()}`,
      email: `student_${formData.enrollment_number.toLowerCase()}@example.com`,
      password: 'password123',
      marks: addedMarks
    };

    console.log("Form Data:", payload);

    try {
      const response = await api.post('/auth/register', payload);
      console.log("API Response:", response.data);

      setSuccessMsg('Student and marks saved successfully!');

      // Close modal and reset form state after a short delay to display success
      setTimeout(() => {
        setShowModal(false);
        setFormData({
          first_name: '',
          last_name: '',
          enrollment_number: '',
          department: '',
          batch_year: 2024,
          current_semester: 1
        });
        setAddedMarks([]);
        setMarkForm({
          subject_id: '',
          semester: 1,
          internal_marks: '',
          external_marks: ''
        });
        setSuccessMsg('');
        fetchData();
      }, 1500);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to add student';
      setErrorMsg(msg);
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMarkToList = () => {
    if (!markForm.subject_id) {
      alert('Please select a subject');
      return;
    }
    
    const subId = parseInt(markForm.subject_id);
    const exists = addedMarks.some(m => m.subject_id === subId);
    if (exists) {
      alert('Marks for this subject have already been added in the list.');
      return;
    }

    const sub = subjects.find(s => s.id === subId);
    if (!sub) return;

    const internal = parseFloat(markForm.internal_marks) || 0;
    const external = parseFloat(markForm.external_marks) || 0;

    if (internal < 0 || internal > 50 || external < 0 || external > 50) {
      alert('Marks must be between 0 and 50');
      return;
    }

    setAddedMarks([
      ...addedMarks,
      {
        subject_id: subId,
        semester: parseInt(markForm.semester as any) || 1,
        internal_marks: internal,
        external_marks: external
      }
    ]);

    // Reset mark form except semester
    setMarkForm({
      ...markForm,
      subject_id: '',
      internal_marks: '',
      external_marks: ''
    });
  };

  const handleRemoveMarkFromList = (subjectId: number) => {
    setAddedMarks(addedMarks.filter(m => m.subject_id !== subjectId));
  };

  const filteredStudents = students.filter(s => 
    s.first_name.toLowerCase().includes(search.toLowerCase()) || 
    s.last_name.toLowerCase().includes(search.toLowerCase()) ||
    s.enrollment_number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout role="admin">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Students Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Add students and assign subject marks seamlessly</p>
        </div>
        <button 
          onClick={() => {
            setShowModal(true);
            setAddedMarks([]);
          }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-sm font-semibold"
        >
          <Plus size={18} />
          <span>Add Student with Marks</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or enrollment number..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Enrollment No.</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Batch</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Semester</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {student.enrollment_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 font-semibold">
                    {student.first_name} {student.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {student.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {student.batch_year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-xs">
                      Sem {student.current_semester}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student with optional Marks Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Plus className="text-indigo-600" size={24} />
                <span>Add New Student & Marks</span>
              </h2>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-gray-500 hover:text-gray-700 dark:hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddStudent} className="flex-1 overflow-y-auto p-6 space-y-6">
              {successMsg && (
                <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm font-semibold animate-pulse border border-green-200">
                  {successMsg}
                </div>
              )}
              {errorMsg && (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm font-semibold border border-red-200">
                  {errorMsg}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Column 1: Student Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white border-b pb-2">
                    Student Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">First Name</label>
                      <input 
                        required 
                        type="text" 
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                        value={formData.first_name} 
                        onChange={e => setFormData({...formData, first_name: e.target.value})} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Last Name</label>
                      <input 
                        required 
                        type="text" 
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                        value={formData.last_name} 
                        onChange={e => setFormData({...formData, last_name: e.target.value})} 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Enrollment Number</label>
                    <input 
                      required 
                      type="text" 
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                      value={formData.enrollment_number} 
                      onChange={e => setFormData({...formData, enrollment_number: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Department</label>
                    <input 
                      required 
                      type="text" 
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                      value={formData.department} 
                      onChange={e => setFormData({...formData, department: e.target.value})} 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Batch Year</label>
                      <input 
                        required 
                        type="number" 
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                        value={formData.batch_year} 
                        onChange={e => setFormData({...formData, batch_year: parseInt(e.target.value) || 2024})} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Current Semester</label>
                      <input 
                        required 
                        type="number" 
                        min="1" 
                        max="8" 
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                        value={formData.current_semester} 
                        onChange={e => {
                          const val = parseInt(e.target.value) || 1;
                          setFormData({...formData, current_semester: val});
                          setMarkForm(prev => ({...prev, semester: val}));
                        }} 
                      />
                    </div>
                  </div>
                </div>

                {/* Column 2: Academic Marks Entry */}
                <div className="space-y-4 flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white border-b pb-2 flex items-center justify-between">
                    <span>Academic Marks (Optional)</span>
                    <span className="text-xs font-normal text-gray-500">Add dynamic marks</span>
                  </h3>
                  
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg space-y-3 border border-gray-100 dark:border-gray-700">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-gray-600 dark:text-gray-400">Subject</label>
                      <select 
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                        value={markForm.subject_id}
                        onChange={e => setMarkForm({...markForm, subject_id: e.target.value})}
                      >
                        <option value="">-- Select Subject --</option>
                        {subjects.map(s => (
                          <option key={s.id} value={s.id}>{s.code} - {s.name} ({s.credits} Credits)</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-gray-600 dark:text-gray-400">Semester</label>
                        <input 
                          type="number" 
                          min="1" 
                          max="8"
                          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                          value={markForm.semester}
                          onChange={e => setMarkForm({...markForm, semester: parseInt(e.target.value) || 1})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-gray-600 dark:text-gray-400">Internal (max 50)</label>
                        <input 
                          type="number" 
                          min="0" 
                          max="50"
                          placeholder="e.g. 40"
                          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                          value={markForm.internal_marks}
                          onChange={e => setMarkForm({...markForm, internal_marks: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-gray-600 dark:text-gray-400">External (max 50)</label>
                        <input 
                          type="number" 
                          min="0" 
                          max="50"
                          placeholder="e.g. 45"
                          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                          value={markForm.external_marks}
                          onChange={e => setMarkForm({...markForm, external_marks: e.target.value})}
                        />
                      </div>
                    </div>

                    <button 
                      type="button" 
                      onClick={handleAddMarkToList}
                      className="w-full mt-2 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 py-1.5 rounded border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition text-sm font-semibold flex items-center justify-center gap-1"
                    >
                      <Plus size={16} />
                      <span>Add Subject Mark</span>
                    </button>
                  </div>

                  {/* Added Marks Table */}
                  <div className="flex-1 min-h-[150px] max-h-[220px] overflow-y-auto border dark:border-gray-700 rounded-lg">
                    {addedMarks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4">
                        <BookOpen size={24} className="mb-1" />
                        <span className="text-xs">No marks added yet. Add marks above.</span>
                      </div>
                    ) : (
                      <table className="w-full text-xs text-left border-collapse">
                        <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0">
                          <tr>
                            <th className="p-2">Subject</th>
                            <th className="p-2">Sem</th>
                            <th className="p-2">Int/Ext</th>
                            <th className="p-2 text-center">Total</th>
                            <th className="p-2 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {addedMarks.map(m => {
                            const sub = subjects.find(s => s.id === m.subject_id);
                            return (
                              <tr key={m.subject_id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                <td className="p-2 font-medium max-w-[120px] truncate">
                                  {sub ? `${sub.code} - ${sub.name}` : m.subject_id}
                                </td>
                                <td className="p-2">S{m.semester}</td>
                                <td className="p-2">{m.internal_marks} / {m.external_marks}</td>
                                <td className="p-2 text-center font-bold">{m.internal_marks + m.external_marks}</td>
                                <td className="p-2 text-center">
                                  <button 
                                    type="button" 
                                    onClick={() => handleRemoveMarkFromList(m.subject_id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

              </div>

              {/* Form Footer */}
              <div className="flex justify-end gap-3 border-t pt-4 dark:border-gray-700">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-semibold shadow-sm disabled:opacity-50"
                >
                  {loading ? 'Saving Student & Marks...' : 'Save Student & Marks'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentsList;
