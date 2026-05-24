import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  BarChart3, 
  GraduationCap,
  FileText
} from 'lucide-react';

interface SidebarProps {
  role: 'admin' | 'student';
}

const Sidebar = ({ role }: SidebarProps) => {
  const location = useLocation();

  const adminLinks = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Students', path: '/admin/students', icon: <Users size={20} /> },
    { name: 'Subjects', path: '/admin/subjects', icon: <BookOpen size={20} /> },
    { name: 'Marks', path: '/admin/marks', icon: <FileText size={20} /> },
    { name: 'Analytics', path: '/admin/analytics', icon: <BarChart3 size={20} /> },
  ];

  const studentLinks = [
    { name: 'Dashboard', path: '/student', icon: <LayoutDashboard size={20} /> },
    { name: 'My Profile', path: '/student/profile', icon: <GraduationCap size={20} /> },
    { name: 'My Marks', path: '/student/marks', icon: <FileText size={20} /> },
  ];

  const links = role === 'admin' ? adminLinks : studentLinks;

  return (
    <div className="hidden lg:flex flex-col w-64 bg-indigo-700 text-white transition-all duration-300">
      <div className="flex items-center justify-center h-20 border-b border-indigo-600">
        <h1 className="text-2xl font-bold tracking-wider flex items-center gap-2">
          <GraduationCap size={28} />
          <span>EduSaaS</span>
        </h1>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-4 py-6 space-y-2">
          {links.map((link) => {
            const isActive = location.pathname === link.path || location.pathname.startsWith(link.path + '/');
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-indigo-800 text-white' 
                    : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'
                }`}
              >
                {link.icon}
                <span className="font-medium">{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
