import React, {useState} from 'react';
import { BrowserRouter, Link } from "react-router-dom";
import '../index.css';

function Navbar({city, setCity}) {

    //Added local useState so that the 
    //city does not change globally amongst components
    //This will be really useful for to determine api calls.
    const [inputCity, setInputCity] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(`${city} has been inputted into the input within Navbar`)
        setCity(inputCity)
    }

    return (
        <nav>
            <div className='flex justify-center my-2 text-white'>
                <div className='border-none border-gray-700 rounded-full ml-5 mr-5 py-2 px-3 sm:px-6 md:px-10 lg:px-20 flex flex-wrap items-center justify-center gap-8 max-w-5xl'>
                    <h1 className='font-bold underline underline-offset-4 decoration-4 decoration-green-500 transition ease-out duration-700'>Weather Project</h1>
                    <Link className='hover:underline hover:underline-offset-4 hover:decoration-4 hover:decoration-blue-500 transition ease-out duration-700' to="/">Home</Link>
                    <Link className='hover:underline hover:underline-offset-4 hover:decoration-4 hover:decoration-blue-500 transition ease-out duration-700' to="/">Radar</Link>

                    <form onSubmit={handleSubmit}>
                        <div className='flex justify-center space-x-2 w-full sm:w-auto'>
                            <input
                                type='text'
                                value={inputCity}
                                onChange={(e) => setInputCity(e.target.value)}
                                placeholder='Enter a City'
                                className='border rounded-3xl py-1 px-5 outline-none text-black'
                            />
                            <button type='submit' className='border-gray-800 rounded-3xl py-1 px-5 bg-gray-700 hover:bg-blue-500 transition ease-out duration-200'>Search</button>
                        </div>
                    </form>

                </div>
            </div>
        </nav>
    )
}

export default Navbar