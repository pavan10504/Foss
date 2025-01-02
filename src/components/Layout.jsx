import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

function Layout({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <div className={`min-h-screen flex dark:bg-gray-900 ${darkMode ? 'dark' : ''}`}>
      <div className="flex-1 dark:bg-gray-900">
        <Sidebar className="h-full"/>
        <main
          className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900
            p-4 transition-all duration-300 rounded-lg lg:rounded-l-none lg:border-l lg:border-gray-200 
            dark:border-gray-700 shadow-inner"
          style={{ marginLeft: '4rem' }}
        >
          <Header darkMode={darkMode} setDarkMode={setDarkMode}/>
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;