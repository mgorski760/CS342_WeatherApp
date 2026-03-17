import React, { useState, useEffect } from 'react';
import { BrowserRouter, Link } from "react-router-dom";
import '../index.css';

function MainCard({city, setCity}) {

    const [weather, setWeather] = useState([]);
    const [dayPicked, setDayPicked] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(!city) {
            setCity("Chicago");
        }
    }, [city]);

    // fetch the data from the backend and store it in the weather variable
    useEffect(() => {
        setLoading(true);
        try {
            fetch(`http://localhost:8080/weather/${city}`)
            .then(res => {
                if(!res.ok) {
                    throw new Error("Failed to fetch the weather data");
                }
                return res.json();
            })
            .then(data => {
                setWeather(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.log("Error fetching weather: ", err);
                setWeather([]);
                setLoading(false);
            })
        } catch(error) {
            console.error("Error: ", error);
            setWeather([]);
            setLoading(false);
        }
    }, [city]);

    return (
        <div className='border-4 border-gray-800 w-3/6 h-[500px] bg-gray-700 mx-auto text-white rounded-lg p-2'>
            <div className='flex flex-col md:flex-row sm:w-full h-full gap-2'>
                <div className='border-4 border-gray-800 sm:w-full md:w-3/6 h-full bg-gray-800 flex flex-col gap-4 p-2'>
                    {loading ? (
                        <p className='text-center animate-pulse'>Loading weather data...</p>
                    ) : weather.length === 0 ? (
                        <p className='text-center text-gray-400'>City not found. Try another search.</p>
                    ) : (
                        weather.map((period, index) => (
                            <div
                            key={index}
                            className=" cursor-pointer text-white flex flex-row justify-between border border-gray-700 rounded-l p-2 bg-gray-700 hover:bg-gray-800 transition ease-out duration-700"
                            onClick={() => setDayPicked(period)}>
                                <img src={period.icon} className='w-9 h-8 object-cover rounded'></img>
                                <span>{period.name}</span>
                                <span>Day: {period.day}°{period.temperatureUnit} | Night: {period.night}°{period.temperatureUnit}</span>
                           </div>
                        ))
                    )}
                </div>

                <div className='flex flex-col w-full md:w-1/2 gap-2'>
                    <div className='border-4 border-gray-800 h-1/2 bg-gray-800 flex flex-row'>
                        {loading ? (
                            <p className='w-full text-center animate-pulse p-2'>Loading weather info...</p>
                        ) : weather.length === 0 ? (
                              <p className='w-full text-center text-gray-400 p-2'>Info not found. Try another search.</p>
                        ) : dayPicked ? (
                            <div className='text-xs'>
                                <h2 className='text-xl font-bold'>{dayPicked.name}</h2>
                                <p>Forecast: {dayPicked.shortForecast}</p>
                                <p>Wind speed: {dayPicked.windSpeed}</p>
                                <p>Wind direction: {dayPicked.windDirection}</p>
                                <h2 className='pt-2 text-xl font-bold'>Detailed forecast</h2>
                                <span className='text-xs'>{dayPicked.detailedForecast}</span>
                            </div>
                        ) : (
                            <p className='w-full text-center text-white p-2'>Select a day</p>
                        )}
                    </div>

                    <div className='border-4 border-gray-800 h-1/2 bg-gray-800 flex-row p-2'>
                        {loading ? (
                            <p className='text-center animate-pulse'>Loading weather radar...</p>
                        ) : weather.length === 0 ? (
                            <p className='w-full text-center text-gray-400 p-2'>No radar found. Try another search.</p>
                        ) : (
                            <p className='w-full text-center text-white p-2'>Radar here</p>
                        )}
                    </div>
                </div>
            </div>
        </div>

    )
}

export default MainCard