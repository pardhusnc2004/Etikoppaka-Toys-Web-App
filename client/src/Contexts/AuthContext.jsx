import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false)

    return (
        <AuthContext.Provider value = {{ isAdmin, setIsAdmin }}>
            { children }
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}