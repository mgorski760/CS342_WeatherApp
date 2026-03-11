import './index.css'
import {Routes, Route} from 'react-router-dom'


import Homepage from './pages/Homepage'
import Navbar from './components/Navbar';


function App() {

  return (
     <Routes>
      <Route path="/" element={<Homepage/>}/>
       <Route path="/test" element={<Navbar/>}/>
     </Routes>
  )
}

export default App
