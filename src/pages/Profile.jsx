import React, { useContext } from 'react'
import { UserProfile } from "@clerk/clerk-react"
import { dark } from '@clerk/themes';


function ProfileCard() {
  const { darkMode } = useContext(DarkModeContext);

  const appearance = {
    baseTheme: darkMode ? dark : "",
  }

  return (
    <div className="w-auto bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Your Profile</h2>
        <div className="w-full max-w-3xl mx-auto">
          <UserProfile appearance={appearance} />
        </div>
      </div>
    </div>
  )
}

export default ProfileCard