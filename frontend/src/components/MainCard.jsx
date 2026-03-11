import React, { useState } from 'react';
import { BrowserRouter, Link } from "react-router-dom";
import '../index.css';

function MainCard() {
    return (
        <div className='border-4 border-gray-800 w-3/6 h-[500px] bg-gray-700 mx-auto text-white rounded-lg p-2'>
            <div className='flex flex-col md:flex-row sm:w-full h-full gap-2'>

                <div className='border-4 border-gray-800 sm:w-full md:w-3/6 h-full bg-gray-800 flex items-center justify-center'>
                    Weather Data here
                </div>

                <div className='flex flex-col w-full md:w-1/2 gap-2'>
                    <div className='border-4 border-gray-800 h-1/2 bg-gray-800 flex items-center justify-center'>
                        Weather Info here
                    </div>

                    <div className='border-4 border-gray-800 h-1/2 bg-gray-800 flex items-center justify-center'>
                        Radar here 
                    </div>
                </div>
            </div>
        </div>

    )
}

export default MainCard