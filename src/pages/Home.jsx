import React from 'react';
import ProfileCard from '../components/ProfileCard';
import QuizCard from '../components/QuizCard';
import GameBadge from '../components/GameBadge';
import AnalyticsChart from '../components/AnalyticsChart';

function Home() {
  return (
    <div className="px-4 py-8 flex flex-col space-y-6">
      {/* Profile and Quiz Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <ProfileCard />
        </div>
        <div className='h-full'>
          <QuizCard />
          <div className='mt-4'>
          <GameBadge/>
          </div>
          <div className='mt-4'>
          <AnalyticsChart/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
