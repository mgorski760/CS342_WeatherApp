import React, { useState, useEffect } from 'react';
import { BrowserRouter, Link } from "react-router-dom";
import '../index.css';

function MainCard({city, setCity}) {

    const [weather, setWeather] = useState([]);
    const [dayPicked, setDayPicked] = useState(null);

    if(!city) {
        return;
    }
    // fetch the data from the backend and store it in the weather variable
    useEffect(() => {
        fetch(`http://localhost:8080/weather/${city}`)
        .then(res => res.json())
        .then(data => {
            setWeather(data);
        });
    }, [city]);

    return (
        <div className='border-4 border-gray-800 w-3/6 h-[500px] bg-gray-700 mx-auto text-white rounded-lg p-2'>
            <div className='flex flex-col md:flex-row sm:w-full h-full gap-2'>
                <div className='border-4 border-gray-800 sm:w-full md:w-3/6 h-full bg-gray-800 flex flex-col gap-4 p-2'>
                    {weather.length === 0 ? (
                        city = 'Chicago'
                    ) : (
                        weather.map((period, index) => (
                            <div
                            key={index}
                            className=" cursor-pointer text-white flex flex-row justify-between border border-gray-700 rounded-l p-2 bg-gray-700 hover:bg-gray-800 transition ease-out duration-700"
                            onClick={() => setDayPicked(period)}>
                                <span>{period.name}</span>
                                <span>High: {period.day}°{period.temperatureUnit} | Low: {period.night}°{period.temperatureUnit}</span>
                           </div>
                        ))
                    )}
                </div>

                <div className='flex flex-col w-full md:w-1/2 gap-2'>
                    <div className='border-4 border-gray-800 h-1/2 bg-gray-800 flex flex-row'>
                        {dayPicked ? (
                            <div className=''>
                                <h2 className='text-xl font-bold'>{dayPicked.name}</h2>
                                <p>Forecast: {dayPicked.shortForecast}</p>
                                <p>Wind speed: {dayPicked.windSpeed}</p>
                                <p>Wind direction: {dayPicked.windDirection}</p>
                            </div>
                        ) : (
                            <p>Select a day</p>
                        )}
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