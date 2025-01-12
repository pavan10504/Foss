import React, { useEffect } from 'react'
import AnalyticsChart from '../components/AnalyticsChart'
import { useUser } from '@clerk/clerk-react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useTheme } from '../components/theme';


ChartJS.register(ArcElement, Tooltip, Legend);

const prepareChartData = (sectionScores) => {
  const labels = sectionScores?.map((section) => section.name);
  const data = sectionScores?.map((section) => section.correctAnswers);
  const colors = sectionScores?.map((section) => section.color);

  return {
    labels,
    datasets: [
      {
        label: "Correct Answers by Section",
        data,
        backgroundColor: colors,
        hoverOffset: 4,
      },
    ],
  };
};

function Analytics() {
  const { darkMode } = useTheme();
  const [resultgenerated, setResult] = React.useState([]);
  const { user } = useUser();
  useEffect(() => {
    const cacheKey = `resultgenerated${user.firstName}`;
    const cachedResults = localStorage.getItem(cacheKey);

    if (cachedResults) {
      setResult(JSON.parse(cachedResults)); 
    }
  }, [user.firstName]);


  return (
    <div className="mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Analytics Page</h1>
      <div className='flex justify-between gap-2 overflow-y-hidden mb-10'>
        <div className='w-1/2 mx-auto'>
          <AnalyticsChart />
        </div>
        <div
          className="relative border  items-start p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg"
          style={{ height: "420px", width: "50%" }}
        >
          <Doughnut
            data={prepareChartData(resultgenerated.performance?.sectionScores)}
            options={{
              plugins: {
                legend: {
                  position: "bottom",
                  align: "start",
                  labels: {
                    font: {
                      size: 12, 
                    },
                    color: darkMode ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)", 
                    padding: 10, 
                  },
                },
              },
              cutout: "70%", 
              maintainAspectRatio: false,
            }}
          />
        </div>
      </div>

      <div className="relative flex justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold mb-3 dark:text-white">Learning Plan</h2>
              <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-2">
                <ul className="list-disc ml-6 space-y-2 dark:text-white mt-2">
                  {resultgenerated.skillsAnalysis?.areasForImprovement.map((area, index) => (
                    <li key={index}>{area.actionItems.join(", ")}</li>
                  ))}
                </ul>
          </div>
        </div>

        
        <div className='mt-0'>
          <h2 className="text-xl font-bold mb-3 dark:text-white">Career Alignment</h2>
          <div className="p-4 bg-gray-100 dark:bg-gray-900 dark:text-white rounded-lg">
            <p className="mb-3">{resultgenerated.careerAlignment?.relevance}</p>
            <ul className="list-disc ml-6 space-y-2">
              {resultgenerated.careerAlignment?.nextSteps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics

