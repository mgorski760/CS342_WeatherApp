import {useState, useEffect} from 'react'
import Navbar from '../components/Navbar'
import RadarCard from '../components/RadarCard'
import RadarInfo from '../components/RadarInfo'

function Radar(){
    return(
        <>
            <div className="min-h-screen bg-gray-900">
                <Navbar/>
                <RadarCard/>
                <RadarInfo/>
            </div> 
        </>


    )
    

}

export default Radar