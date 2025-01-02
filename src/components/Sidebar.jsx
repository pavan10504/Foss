import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Gamepad, User, BarChart } from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: BookOpen, label: 'Quiz', path: '/quiz' },
  { icon: Gamepad, label: 'Games', path: '/games' },
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: BarChart, label: 'Analytics', path: '/analytics' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="fixed top-[50%] translate-y-[-50.5%] left-2 z-30 h-[95%] bg-white dark:bg-gray-800 rounded-lg border-gray-200 dark:border-gray-700 shadow-lg group transition-all duration-300">
      {/* Sidebar Container */}
      <div className="h-full w-16 group-hover:w-64 overflow-hidden transition-all duration-300">
        {/* Logo Section */}
        <div className="flex items-center justify-center py-4">
          <span className="text-sm font-semibold text-white dark:text-gray-800 group-hover:text-gray-800 group-hover:text-xl group-hover:dark:text-white">
            Edu Platform
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="mt-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 ${
                location.pathname === item.path
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-500'
                  : ''
              }`}
            >
              <item.icon className="w-6 h-6" />
              {/* Label is hidden by default and only visible on hover */}
              <span className="ml-4 hidden group-hover:block">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
