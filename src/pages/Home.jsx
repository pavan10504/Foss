import React, { useState, useEffect } from 'react';
import ProfileCard from '@/components/ProfileCard';
import QuizCard from '@/components/QuizCard';
import GameBadge from '@/components/GameBadge';
import AnalyticsChart from '@/components/AnalyticsChart';
import OnboardingFlow from "../components/OnboardingFlow";
import QuizForm from "../components/QuizForm"; 
const Home = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);


  useEffect(() => {
    const isFirstVisit = !localStorage.getItem("onboardingComplete");
    setShowOnboarding(isFirstVisit);
  }, []);


  const handleOnboardingComplete = () => {
    localStorage.setItem("onboardingComplete", "true");
    setShowOnboarding(false);
    setShowQuiz(true);
  };

  const handleQuizComplete = () => {
    setShowQuiz(false);
  };
  return (
    <div>
      {showOnboarding && <OnboardingFlow onComplete={handleOnboardingComplete} />}
      {!showOnboarding && showQuiz && <QuizForm onComplete={handleQuizComplete} />}
      {!showOnboarding && !showQuiz && (
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
  )}
    </div>
  );
};

export default Home;