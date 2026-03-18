import {useState, useEffect} from 'react'
import AiCard from '../components/AiCard'
import Navbar from '../components/Navbar'
import Footer from '../components/footer'
import MainCard from '../components/MainCard';

function Homepage(){

    const [city, setCity] = useState("");

    return(
        <>
          <div className ="min-h-screen bg-gray-900">
            <Navbar city={city} setCity={setCity}/>
            <div className="max-w-5/6">
                <AiCard city={city}/>
            </div>
            <div className='pt-10 pb-10 h-full'>
                <MainCard city={city || "Chicago"} setCity={setCity}/>
            </div>
          </div>
          <Footer/>
        </>
    )
}

export default Homepage
