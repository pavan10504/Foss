import React from 'react';

export default function Trends() {
    return (
        <div className='bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800 h-screen'>
            <iframe src='https://tejas-007-11.github.io/career-trend-frontend/' className='w-screen h-screen' onChange={alert('The server needs a bit of time to wake up...please wait patiently')}></iframe>           
        </div>
    );
}