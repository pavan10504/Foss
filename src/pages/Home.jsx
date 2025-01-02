import React from 'react'
import ProfileCard from '../components/ProfileCard'
import QuizCard from '../components/QuizCard'
import GameBadge from '../components/GameBadge'
import AnalyticsChart from '../components/AnalyticsChart'

function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProfileCard />
        <QuizCard className='h-auto'/>
        <div className="space-y-6">
          <GameBadge />
          <AnalyticsChart />
        </div>
      </div>
    </div>
  )
}

export default Home

