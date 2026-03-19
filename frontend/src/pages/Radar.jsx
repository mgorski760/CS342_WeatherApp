import {useState, useEffect} from 'react'
import Navbar from '../components/Navbar'
import RadarCard from '../components/RadarCard'
import RadarInfo from '../components/RadarInfo'

function Radar(){

    const [city, setCity] = useState("");

    return(
        <>
            <div className="min-h-screen bg-gray-900">
                <Navbar city={city} setCity={setCity}/>
                <RadarCard city={city} setCity={setCity}/>
                <RadarInfo/>
            </div> 
        </>


    )


}

export default Radar