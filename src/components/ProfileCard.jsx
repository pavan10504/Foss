import React from 'react'
import { UserProfile } from "@clerk/clerk-react"

function ProfileCard() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Your Profile</h2>
        <UserProfile />
      </div>
    </div>
  )
}

export default ProfileCard

