import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContent.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import './App.css'


function App() {
  
  return (
    <>
    <AuthProvider>
      <Router>
      <div className="App">
      <Routes >
        <Route path="/" element = {<Home />} />
        <Route path="/login" element = {<Login />} />
        <Route path="/signup" element = {<Signup />} />
      </Routes>
      </div>
      </Router>
    </AuthProvider>
      
    </>
  )
}

export default App
