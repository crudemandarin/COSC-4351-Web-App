import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Confirmation from './pages/Confirmation/Confirmation';
import Landing from './pages/Landing/Landing';


const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/profile" element={<h1>profile</h1>} />
      </Routes>
    </BrowserRouter>
  )
}


export default App;
