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
                <a className="text-2xl font-bold tracking-wide text-slate-300 transition-colors duration-300">
                    Lacquer Toys
                </a>
            </div>
            <div className="flex gap-2">
                <input onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
                <div className="navbar-end">
                    <button className="btn bg-blue-800 hover:bg-blue-700" onClick={handleLogin}>{isAdmin? "Logout": "Admin?"}</button>
                </div>
            </div>
        </div>
    )
}

export default Navbar