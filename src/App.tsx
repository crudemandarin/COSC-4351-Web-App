import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from './pages/Landing/Landing';
import Confirmation from './pages/Confirmation/Confirmation';
import Login from './components/LogIn';
import Signup from './components/SignUp';
import './styles/styles.css';


const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/confirmation" element={<Confirmation props />} />
        <Route path="/profile" element={<h1>profile</h1>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
      </Routes>
    </BrowserRouter>
  )
}


export default App;
