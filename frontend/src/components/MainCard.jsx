import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Link } from "react-router-dom";
import '../index.css';
import forecast from '../assets/forecast.png';
import wind from '../assets/wind.png';
import direction from '../assets/direction.png';
import info from '../assets/info.png';

function MainCard({city, setCity}) {

    const [weather, setWeather] = useState([]);
    const [dayPicked, setDayPicked] = useState(null);
    const [loading, setLoading] = useState(false);
    const [lat, setLat] = useState(50.4);
    const [lon, setLon] = useState(14.3);

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

        const didInit = useRef(false);
        const windyRef = useRef(null);
       
    
        useEffect(() =>{
            if (didInit.current){
                return; //Don't re init the page
            }
            didInit.current = true;
    
            let cancelled = false;
            const container = document.getElementById("windy");
            
            
            const options = {
                key: import.meta.env.VITE_WINDY_API, 
                verbose: true,
                lat: 50.4,
                lon: 14.3,
                zoom: 5,
            };
    
            // Initialize Windy API
           window.windyInit(options, windyAPI => {
                
                const { map } = windyAPI;
                windyRef.current = windyAPI;
                // .map is instance of Leaflet map
    
                L.popup()
                    .setLatLng([lat, lon])
                    .openOn(map);
            });
    
            return () => {
                cancelled = true;
            };
        },[]);
    
        //update the lat and long based on user input in navbar.
        useEffect(() => {
            console.log(city);
            console.log("City updated. Changing positioning.");
    
            async function loadData(){
                try{
                    let res = await fetch(`http://localhost:8080/weather/getcoords/${city}`);
                    let data = await res.json();
                    if(!res.ok){ throw new Error(`HTTP ${res.status}`);}
                    const nextLat = Number(data.lat);
                    const nextLon = Number(data.lon);
                    if(nextLat == null || nextLon == null){
                        throw new Error("API gave me wrong lat/lon");
                    }
    
                    setLat(nextLat);
                    setLon(nextLon);
    
                    if (windyRef.current?.map) {
                        windyRef.current.map.setView([nextLat, nextLon], 9);
                    }   
                } catch(e){
                    console.error(e.message);
                }
            }
            
            loadData();
        }, [city])

    return (
        <div className='border-4 border-gray-800 w-3/6 h-[500px] bg-gray-700 mx-auto text-white rounded-lg p-2'>
            <div className='flex flex-col md:flex-row sm:w-full h-full gap-2'>
                <div className='border-4 border-gray-800 sm:w-full md:w-3/6 h-full bg-gray-800 flex flex-col gap-4 p-2 overflow-y-auto max-h-[60vh]'>
                    {loading ? (
                        <p className='text-center animate-pulse'>Loading weather data...</p>
                    ) : weather.length === 0 ? (
                        <p className='text-center text-gray-400'>City not found. Try another search.</p>
                    ) : (
                        weather.map((period, index) => (
                            <div
                            key={index}
                            className=" cursor-pointer
                                        text-white
                                        flex flex-col items-center sm:flex-row sm:items-center sm:justify-between
                                        gap-2 sm:gap-3
                                        w-full
                                        border border-gray-700 rounded-l p-2 bg-gray-700 hover:bg-gray-800
                                        transition ease-out duration-700"
                            onClick={() => setDayPicked(period)}>
                                <img src={period.icon} className='w-9 h-8 object-cover rounded'></img>
                                <span className='text-center sm:text-left font medium break-words'>{period.name}</span>
                                <span className='text-center sm:text-right break-words'>Day: {period.day}°{period.temperatureUnit} | Night: {period.night}°{period.temperatureUnit}</span>

                           </div>
                        ))
                    )}
                </div>

                <div className='flex flex-col w-full md:w-1/2 gap-2 '>
                    <div className='border-4 border-gray-800 h-1/2 bg-gray-800 flex flex-row overflow-y-auto max-h-[60vh]'>
                        {loading ? (
                            <p className='w-full text-center animate-pulse p-2'>Loading weather info...</p>
                        ) : weather.length === 0 ? (
                              <p className='w-full text-center text-gray-400 p-2'>Info not found. Try another search.</p>
                        ) : dayPicked ? (
                            <div className='text-xs'>
                                <h2 className='text-xl font-bold underline underline-offset-4 decoration-4 decoration-green-500'>{dayPicked.name}</h2>

                                <div className='flex flex-row items-start gap-3 pt-2'>
                                    <img src={forecast}></img>
                                    <p>Forecast: {dayPicked.shortForecast}</p>

                                </div>

                                <div className='flex flex-row items-start gap-3'>
                                    <img src={wind}></img>
                                    <p>Wind speed: {dayPicked.windSpeed}</p>
                                </div>

                                <div className='flex flex-row items-start gap-3'>
                                    <img src={direction}></img>
                                    <p>Wind direction: {dayPicked.windDirection}</p>
                                </div>

                                <h2 className='pt-2 text-xl font-bold underline underline-offset-4 decoration-4 decoration-blue-500'>Detailed forecast</h2>

                                <div className='flex flex-row items-start gap-3 pt-2'>
                                    <img src={info}></img>
                                    <p>{dayPicked.detailedForecast}</p>
                                </div>

                            </div>
                        ) : (
                            <p className='w-full text-center text-white p-2'>Select a day</p>
                        )}
                    </div>

                    <div className='border-4 border-gray-800 h-1/2 bg-gray-800 flex-row p-2 overflow-y-auto max-h-[60vh]'>
                        <div id="windy" className="w-full h-full windy-clean"></div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default MainCard