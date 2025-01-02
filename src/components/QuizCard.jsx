import React from 'react'

function QuizCard() {
  return (
    <div className="h-auto bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Latest Quiz</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">Test your knowledge with our latest quiz!</p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300">
          Start Quiz
        </button>
      </div>
    </div>
  )
}

export default QuizCard

