import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useTheme } from './theme';
import Chart from 'chart.js/auto';

function AnalyticsChart() {
  const { darkMode } = useTheme();

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
        },
      },
      title: {
        display: true,
        text: 'Your Progress',
        color: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
      },
      tooltip: {
        backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
        titleColor: darkMode ? '#000000' : '#ffffff',
        bodyColor: darkMode ? '#000000' : '#ffffff',
      },
    },
    scales: {
      x: {
        ticks: {
          color: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
        },
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        ticks: {
          color: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
        },
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  const data = {
    labels: ['Math', 'Science', 'History', 'Literature', 'Art'],
    datasets: [
      {
        label: 'Score',
        data: [65, 59, 80, 81, 56],
        backgroundColor: darkMode
          ? 'rgba(75, 192, 192, 1)' // Bar color in dark mode
          : 'rgba(53, 162, 235, 1)', // Bar color in light mode
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Analytics</h2>
      <Bar options={options} data={data} />
    </div>
  );
}

export default AnalyticsChart;
