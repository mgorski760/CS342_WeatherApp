import React from 'react';
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Link } from "react-router-dom";
import '../index.css';

function Navbar() {
    return (
        <nav>
            <div className='flex justify-center mt-10'>
                <div className='border rounded-3xl py-2 px-20 space-x-20 inline-flex items-center'>
                    <h1>CS342 Project</h1>
                    <Link to="/">Home</Link>
                    <Link to="/">Weather Radar</Link>
                    <input
                        type='text'
                        placeholder='Enter a City'
                        className='border rounded-3xl px-5 py-1 outline-none'
                    />
                </div>
            </div>
        </nav>


    )
}

export default Navbar