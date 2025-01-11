import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Gamepad, User, BarChart, Bot ,SettingsIcon } from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Dashboard', path: '/home' },
  { icon: BookOpen, label: 'Quiz', path: '/quiz' },
  { icon: Gamepad, label: 'Games', path: '/games' },
  { icon: BarChart, label: 'Analytics', path: '/analytics' },
  { icon: Bot, label: 'Chatbot', path: '/chatbot' },
  { icon: SettingsIcon, label: 'Profile', path: '/profile', isLast: true }, 
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="fixed top-[50%] translate-y-[-50.5%] left-2 z-30 h-[95%] bg-white dark:bg-gray-800 rounded-lg border-gray-200 dark:border-gray-700 shadow-lg group transition-all duration-300">
      <div className="h-full w-14 group-hover:w-64 overflow-hidden transition-all duration-300 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-center p-4 mb-2">
          </div>

          {/* Navigation Items */}
          <nav className="mt-auto">
            {navItems
              .filter((item) => !item.isLast) // Render non-last items first
              .map((item) => (
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
                  <span className="ml-4 hidden group-hover:block">{item.label}</span>
                </Link>
              ))}
          </nav>
        </div>

        {/* Profile Item */}
        <div className="mt-auto">
          {navItems
            .filter((item) => item.isLast) // Render last item separately
            .map((item) => (
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
                <span className="ml-4 hidden group-hover:block">{item.label}</span>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
