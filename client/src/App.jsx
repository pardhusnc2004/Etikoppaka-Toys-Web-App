import React from 'react'
import toast, { Toaster } from 'react-hot-toast'
import Navbar from './Components/Navbar/Navbar.jsx'
import Footer from './Components/Footer/Footer.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './Pages/HomePage/HomePage'

const App = () => {
  return (
    <div className='px-4 py-3 text-blue-500'>
      <Toaster position='top-right' />
      <Navbar />
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />} />
        </Routes>
      </Router>
      <Footer />
    </div>
  )
}

export default App