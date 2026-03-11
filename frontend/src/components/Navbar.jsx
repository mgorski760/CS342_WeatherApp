import React, { useState } from 'react';
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Link } from "react-router-dom";
import '../index.css';

function Navbar() {

    const [city, setCity] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(city);
    }

    return (
        <nav>
            <div className='flex justify-center pt-10 text-white'>
                <div className='border rounded-3xl ml-5 mr-5 py-2 px-2 sm:px-6 md:px-10 lg:px-20 flex flex-wrap items-center justify-center gap-8 max-w-5xl'>
                    <h1 className='font-bold underline underline-offset-4 decoration-4 decoration-green-300 transition ease-out duration-700'>Weather Project</h1>
                    <Link className='hover:underline hover:underline-offset-4 hover:decoration-4 hover:decoration-blue-500 transition ease-out duration-700' to="/">Home</Link>
                    <Link className='hover:underline hover:underline-offset-4 hover:decoration-4 hover:decoration-blue-500 transition ease-out duration-700' to="/">Radar</Link>

                    <form onSubmit={handleSubmit}>
                        <div className='flex justify-center space-x-2 w-full sm:w-auto'>
                            <input
                                type='text'
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder='Enter a City'
                                className='border rounded-3xl py-1 px-5 outline-none text-black'
                            />
                            <button type='submit' className='border rounded-3xl py-1 px-5 bg-gray-700 hover:bg-blue-500 transition ease-out duration-700'>Search</button>
                        </div>
                    </form>

                </div>
            </div>
        </nav>
    )
}

export default Navbar