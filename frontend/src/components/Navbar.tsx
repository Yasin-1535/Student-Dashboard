import { User } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white lg:hidden">
            CGPA SaaS
          </h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <User size={20} />
            <span className="font-medium">Admin User</span>
            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full uppercase ml-2">
              admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
