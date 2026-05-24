import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import StudentsList from './pages/StudentsList';
import ManageSubjects from './pages/ManageSubjects';
import ManageMarks from './pages/ManageMarks';
import Analytics from './pages/Analytics';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<StudentsList />} />
        <Route path="/admin/subjects" element={<ManageSubjects />} />
        <Route path="/admin/marks" element={<ManageMarks />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        
        {/* Student Routes */}
        <Route path="/student" element={<StudentDashboard />} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
