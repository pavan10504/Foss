import React from 'react';
import { SignedOut } from "@clerk/clerk-react";
import { Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';  // Use useNavigate instead of useHistory

function SignedOutHeader({ darkMode, setDarkMode }) {
  const navigate = useNavigate();  // Initialize the navigate function

  // Custom button to redirect to the SignIn page
  const handleSignIn = () => {
    navigate('/sign-in');  // Use navigate to redirect
  };
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">SKILL QUEST</h1>
            <div className="flex items-center">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none dark:hover:text-gray-300"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>
        <div className='fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>
        <main className="flex-grow text-center py-8">
        <div className='mb-8'>
        <p className="mb-4 text-lg">You are currently signed out. Please sign in to continue.</p>
        </div>
      <button
      onClick={handleSignIn} 
      className="relative px-8 py-4 bg-yellow-300 border-4 border-black text-xl font-black uppercase tracking-wider transform transition-all duration-200 ease-in-out
        before:absolute before:content-[''] before:w-full before:h-full before:bg-yellow-300 before:border-4 before:border-black before:-z-10 before:left-4 before:top-4
        hover:before:left-2 hover:before:top-2 hover:-translate-y-1 hover:translate-x-1 hover:rotate-1
        active:before:left-0 active:before:top-0 active:translate-x-4 active:translate-y-4
        hover:bg-yellow-400 hover:scale-105">
        Sign In
      </button>
    </main>
        </div>
      

      {/* Footer */}
      <footer className="bg-gray-200 text-center py-4 mt-auto">
        <p>© 2025 Skill Quest. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default SignedOutHeader;
