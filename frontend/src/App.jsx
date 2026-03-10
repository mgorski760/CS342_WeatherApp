import './index.css'
import {Routes, Route} from 'react-router-dom'

import Homepage from './pages/Homepage'

function App() {

  return (
     <Routes>
        <Route path="/h" element={<Homepage/>}/>      
     </Routes>
  )
}
import { BrowserRouter } from 'react-router-dom';

export default App
