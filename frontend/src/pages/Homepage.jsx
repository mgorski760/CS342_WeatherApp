import ai_advisor_card from '../components/ai_advisor_card'
import Navbar from '../components/Navbar'

function Homepage(){
    return(
        <>
          <div className ="min-h-screen bg-black">
            <Navbar/>
            <ai_advisor_card/>

          </div>
        </>
    )
}

export default Homepage
