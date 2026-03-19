import {useEffect, useState} from "react"

function RadarInfo({city, lat, lon}){

    const [weather, setWeather] = useState([]);
    const [loading, setLoading] = useState(false);
    
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

    const now = weather[0] || {}; //if fetching weather fails

    const tempWithUnit = now.temperature !== undefined && now.temperatureUnit ? `${now.temperature}°${now.temperatureUnit}` : "";
    const windSpeed = now.windSpeed || "";
    const windDirection = now.windDirection || "";
    const longForecast = now.detailedForecast || now.shortForecast || "";

    return(
        <>
            <div className="border-4 border-gray-800 w-2/6  bg-gray-700 mx-auto text-white rounded-lg p-2 m-4">
                {loading ? (
                        <p className='text-center animate-pulse'>Loading Data...</p>
                    ) : weather.length === 0 ? (
                        <p className='text-center text-gray-400'>City not found. Try another search.</p>
                    ) : (<>
                            <h1 className="font-bold text-center">{city.toUpperCase()}</h1>
                            <p className="text-center">{lat}°N {lon}°S</p>
                            <div className="flex flex-col gap-2">
                            
                            <div className="flex gap-2 p-1">
                                <div className="flex-1 bg-gray-800 rounded p-1 text-center">
                                    <p className="text-xs text-gray-300">Temperature</p>
                                    <p className="font-semibold">{tempWithUnit}</p>
                                </div>
                                <div className="flex-1 bg-gray-800 rounded p-1 text-center">
                                    <p className="text-xs text-gray-300">Wind Speed</p>
                                    <p className="font-semibold">{windSpeed}</p>
                                </div>
                                <div className="flex-1 bg-gray-800 rounded p-1 text-center">
                                    <p className="text-xs text-gray-300">Wind Direction</p>
                                    <p className="font-semibold">{windDirection}</p>
                                </div>
                            </div>

                            
                            <div className="bg-gray-800 rounded p-2">
                                <p className="text-xs text-gray-300 text-center">Forecast</p>
                                <p className="text-sm">{longForecast}</p>
                            </div>
                        </div>              
                        </>
                    )}
                
            </div>
        </>
    )
}

export default RadarInfo