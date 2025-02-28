import React from 'react'
import toast, { Toaster } from 'react-hot-toast'
import Navbar from './Components/Navbar/Navbar.jsx'
import Footer from './Components/Footer/Footer.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './Pages/HomePage/HomePage'
import AddItem from './Pages/AddItemPage/AddItem.jsx'
import UpdateItem from './Pages/UpdateItemPage/UpdateItem.jsx'

const App = () => {
  return (
    <div className='px-4 py-3 text-blue-500'>
      <Toaster position='top-right' />
      <Navbar />
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/add-item' element={<AddItem />} />
          <Route path={`/update-item/:_id`} element={<UpdateItem />} />
        </Routes>
      </Router>
      <Footer />
    </div>
  )
}

export default App