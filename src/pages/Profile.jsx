import React from 'react'
import { UserProfile } from "@clerk/clerk-react"

function Profile() {
  return (
    <div className="w-full mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Profile Page</h1>
      <UserProfile className='w-full'/>
    </div>
  )
}

export default Profile

