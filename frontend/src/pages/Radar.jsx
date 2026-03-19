import {useState, useEffect} from 'react'
import Navbar from '../components/Navbar'
import RadarCard from '../components/RadarCard'
import RadarInfo from '../components/RadarInfo'

function Radar(){

    const [city, setCity] = useState("Chicago");
    const [lat, setLat] = useState(0);
    const [lon, setLon] = useState(0);

    return(
        <>
            <div className="min-h-screen bg-gray-900">
                <Navbar city={city} setCity={setCity}/>
                <RadarCard city={city} lat={lat} setLat={setLat} lon={lon} setLon={setLon}/>
                <RadarInfo city={city} lat={lat} lon={lon}/>
            </div> 
        </>


    )


}

export default Radar