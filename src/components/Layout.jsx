import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { ThemeContext } from './theme';

function LayoutContent({ children }) {
  const { darkMode } = React.useContext(ThemeContext);
  
  return (
    <div className={`min-h-screen flex bg-gray-100 border-none dark:bg-gray-900 ${darkMode ? 'dark' : ''}`}>
      <div className="flex-1 dark:bg-gray-900">
        <Sidebar className="h-full"/>
        <main
          className="flex-1 overflow-x-hidden overflow-y-auto border-none bg-gray-100 dark:bg-gray-900
            p-4 transition-all duration-300 rounded-lg lg:rounded-l-none lg:border-l 
            dark:border-gray-700 shadow-inner"
          style={{ marginLeft: '4rem' }}
        >
          <Header/>
          {children}
        </main>
      </div>
    </div>
  );
}

function Layout({ children }) {
  const [darkMode, setDarkMode] = React.useState(false);
  
  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <LayoutContent>{children}</LayoutContent>
    </ThemeContext.Provider>
  );
}

export default Layout;