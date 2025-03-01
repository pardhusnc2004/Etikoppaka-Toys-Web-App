import React, { useEffect, useState } from 'react'
import { useAuth } from '../../Contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useSearch } from '../../Contexts/SearchContext'

const Navbar = () => {
    const { isAdmin, setIsAdmin } = useAuth()
    const { searchQuery, setSearchQuery } = useSearch()
    const navigate = useNavigate()
    const [tryingToLogin, setTryingToLogin] = useState(false)
    useEffect(() => {
        if(tryingToLogin) {
            navigate("/auth/login")
            setTryingToLogin(false)
        }
    }, [tryingToLogin])

    const handleAddItem = () => {
        navigate("/add-item")
    }

    const handleLogin = async () => {
        if(isAdmin) {
            try {
                const response = await axios.post('http://localhost:4000/api/v1/auth/logout')
                toast.success(response.data.message)
            } catch (error) {
                toast.error(error.message)
            }
            setIsAdmin(false)
        } else {
            setTryingToLogin(true)
        }
    }

    return (
        <div className="navbar">
            <div className="flex-1">
                <a className="text-xl">Lacquer Toys</a>
            </div>
            <div style={{paddingRight:"13px"}} className="absolute left-1/2 transform -translate-x-1/2">
                <btn onClick={handleAddItem} className="btn bg-green-800 text-slate-300 cursor-pointer">Add Item</btn>
            </div>
            <div className="flex gap-2">
                <input onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
                <div className="navbar-end">
                    <button className="btn bg-blue-800" onClick={handleLogin}>{isAdmin? "Logout": "Admin?"}</button>
                </div>
            </div>
        </div>
    )
}

export default Navbar