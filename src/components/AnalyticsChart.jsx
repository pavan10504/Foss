import React from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Your Progress',
    },
  },
}

const data = {
  labels: ['Math', 'Science', 'History', 'Literature', 'Art'],
  datasets: [
    {
      label: 'Score',
      data: [65, 59, 80, 81, 56],
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
}

function AnalyticsChart() {
  return (
    <div className="w-1/2 h-1/2 bg-white rounded-lg shadow-md overflow-hidden p-6 dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Analytics</h2>
      <Bar options={options} data={data} />
    </div>
  )
}

export default AnalyticsChart

