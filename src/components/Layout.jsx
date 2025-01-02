import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

function Layout({ children }) {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className={`h-screen flex ${darkMode ? 'dark' : ''}`}>
      <div className="flex h-full">
        <div className="flex-1 flex flex-col">
          <Sidebar/>
          <Header darkMode={darkMode} setDarkMode={setDarkMode} />
          <main
            className="flex-2 w-full overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 
                       p-4 lg:ml-20 rounded-lg lg:rounded-l-none lg:border-l lg:border-gray-200 
                       dark:border-gray-700 shadow-inner"
            style={{ marginLeft: 'calc(4rem + 1rem)' }} // Adjust according to sidebar width + gap
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

export default Layout

