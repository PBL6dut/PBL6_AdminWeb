import { createContext, useState } from "react";
import authService from "../services/authService";

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const storedToken = localStorage.getItem('token') || ""
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [token, setToken] = useState(storedToken)

    const login = async (email, password) => {
        try {
            const response = await authService.login(email, password)
            if(response && response.status === 200) {
                const data = response.data
                console.log(response.data)
                localStorage.setItem('token', data.token)
                setToken(data.token)
                setIsAuthenticated(true)
            }
        } catch (error) {
            console.error("Login failed:", error)
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        setToken(null)
        setIsAuthenticated(false)
    }

    const verifyToken = async (token) => {
        try {
            const response = await authService.verifyToken(token)
            if(response && response.status === 200) {
                setIsAuthenticated(true)
            } else {
                logout()
            }
        } catch (error) {
            console.error("Token verification failed:", error)
            logout()
        }
    }

    if(storedToken) {
        verifyToken(storedToken)
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
