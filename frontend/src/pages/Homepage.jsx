import {useState} from 'react'
import AiCard from '../components/AiCard'
import Navbar from '../components/Navbar'
import Footer from '../components/footer'

function Homepage(){

    const [city, setCity] = useState("");

    return(
        <>
          <div className ="min-h-screen bg-gray-900">
            <Navbar city={city} setCity={setCity}/>
            <div className="max-w-5/6 border-white ">
                <AiCard city={city}/>
            </div>
          </div>
          <Footer/>
        </>
    )
}

export default Homepage
