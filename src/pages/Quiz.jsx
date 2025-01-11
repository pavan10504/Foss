import React from 'react'
import QuizForm from '@/components/QuizForm'
import Results from '@/components/results'

function Quiz() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 dark:text-white">Quiz Page</h1>

      <div>
        <p className='mt-6'>This is just the skeleton of the weekly quiz</p>

        <div className='grid grid-cols-4 gap-4 mt-4'>
          <div className='bg-gray-200 p-4 h-500 w-50 rounded-lg'>
            <h>Quiz 1</h>
            <p className='mt-6'> 
              This week's quiz1 is about <strong>Maths</strong>
            </p>
          </div>
          <div className='bg-gray-200 p-4 h-50 w-50 rounded-lg'>
          <h>Quiz 2</h>
          <p className='mt-6'> 
            This week's quiz2 is about <strong>Science</strong>
          </p>
          </div>
          <div className='bg-gray-200 p-4 h-50 w-50 rounded-lg'>
          <h>Quiz 3</h>
          <p className='mt-6'> 
            This week's quiz3 is about <strong>History</strong>
          </p>
          </div>
          <div className='bg-gray-200 p-4 h-50 w-50 rounded-lg'>
          <h>Quiz 4</h>
          <p className='mt-6'> 
            This week's quiz4 is about <strong>Geography</strong>
          </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Quiz

