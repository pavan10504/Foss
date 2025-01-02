import React from 'react'
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Sun, Moon } from 'lucide-react'

function Header({ darkMode, setDarkMode }) {
    return (
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
                        <div className="ml-4">
                            <SignedOut>
                                <SignInButton />
                            </SignedOut>
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header

