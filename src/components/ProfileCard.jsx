import React from 'react'
import { UserProfile } from "@clerk/clerk-react"
import { dark} from '@clerk/themes'
import { useTheme } from './theme';

function ProfileCard() {
  const { darkMode } = useTheme();
  return (
    <div className="w-auto bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Your Profile</h2>
        <UserProfile appearance={{
          baseTheme: darkMode ? dark : "",
          variables: {
            colorBackground: darkMode ? '#1f2937' : '#ffffff',
            colorText: darkMode ? '#ffffff' : '#1f2937',
          }}}/>
      </div>
    </div>
  )
}

export default ProfileCard

