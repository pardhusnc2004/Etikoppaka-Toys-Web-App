import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from '../../Contexts/AuthContext.jsx'
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

const AdminLogin = () => {
    const { isAdmin, setIsAdmin } = useAuth()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    useEffect(() => {
        console.log("Updated isAdmin:", isAdmin);
    }, [isAdmin]);

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:4000/api/v1/auth/login', {
                username: username,
                password: password
            }, { withCredentials: true })
            if(response.status == 200) {
                setIsAdmin(true)
                toast.success(response.data.message)
                navigate("/")
            } else {
                setUsername("")
                setPassword("")
                toast.error("Invalid credentials")
            }
        } catch (error) {
            toast.error("Invalid credentials")
            setUsername("")
            setPassword("")
        }
    }

    return (
        <div className="flex flex-col space-y-4 p-4 max-w-sm mx-auto text-slate-400">
            <label className="relative flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
                <FontAwesomeIcon style={{paddingLeft: "19px"}} icon={faUser} />
                <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username" 
                    className="w-full pl-10 pr-3 py-2 focus:outline-none bg-transparent" 
                />
            </label>

            <label className="relative flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
                <FontAwesomeIcon style={{paddingLeft: "19px"}} icon={faKey} />
                <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password" 
                    className="w-full pl-10 pr-3 py-2 focus:outline-none bg-transparent" 
                />
            </label>

            <button className="btn bg-blue-600" onClick={handleLogin}>
                Login
            </button>
        </div>
    )
}

export default AdminLogin;