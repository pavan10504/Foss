import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const ProfileCard = () => {
  const { user } = useUser();

  // You would typically fetch this data from your backend
  const userProgress = {
    testsCompleted: 0,
    currentLevel: 'Beginner',
    nextMilestone: 'Complete first assessment',
    careerGoal: 'Loading...' // This would come from your stored user data
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Profile Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* User Info Section */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              {user?.imageUrl ? (
                <img 
                  src={user.imageUrl} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-blue-500">
                  {user?.firstName?.[0] || 'U'}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-gray-500">{user?.primaryEmail}</p>
            </div>
          </div>

          {/* Progress Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-600">Tests Completed</h4>
              <p className="text-2xl font-bold">{userProgress.testsCompleted}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-600">Current Level</h4>
              <p className="text-2xl font-bold">{userProgress.currentLevel}</p>
            </div>
          </div>

          {/* Career Goal Section */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-600">Career Goal</h4>
            <p className="text-lg font-semibold">{userProgress.careerGoal}</p>
          </div>

          {/* Next Steps */}
          <div className="p-4 border border-blue-100 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-600">Next Milestone</h4>
            <p className="mt-1">{userProgress.nextMilestone}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;