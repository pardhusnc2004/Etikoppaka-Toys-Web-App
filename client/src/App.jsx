import React from 'react'
import toast, { Toaster } from 'react-hot-toast'
import Navbar from './Components/Navbar/Navbar.jsx'
import Footer from './Components/Footer/Footer.jsx'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import HomePage from './Pages/HomePage/HomePage'
import AddItem from './Pages/AddItemPage/AddItem.jsx'
import UpdateItem from './Pages/UpdateItemPage/UpdateItem.jsx'
import AdminLogin from './Pages/AdminLoginPage/AdminLogin.jsx'
import { useAuth } from './Contexts/AuthContext.jsx'
import YouAreNotAdmin from './Pages/YouAreNotAdminPage/YouAreNotAdmin.jsx'

const App = () => {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  return (
    <div className='flex flex-col h-screen px-4 py-3 text-blue-500'>
      <Toaster position='top-right' />
      <Navbar />
      <div className='flex-grow'>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/add-item' element={(isAdmin)? <AddItem />: <YouAreNotAdmin />} />
            <Route path={`/update-item/:_id`} element={(isAdmin)?<UpdateItem />: <YouAreNotAdmin />} />
            <Route path='/auth/login' element={<AdminLogin />} />
          </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App