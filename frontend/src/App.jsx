import './index.css'
import {Routes, Route} from 'react-router-dom'


import Homepage from './pages/Homepage'
import Radar from './pages/Radar'


function App() {

  

  return (
     <Routes>
      <Route path="/" element={<Homepage/>}/>
      <Route path="/radar" element={<Radar/>}/>
     </Routes>
  )
}

export default App
