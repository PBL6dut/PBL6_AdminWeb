import axios from './axios'

const login = async (email, password) => {
    try {
        const response = await axios.post('/auth/admin/login', { email, password })
        return response
    } catch (error) {
        console.error("Login failed:", error)
        throw error
    }
}
///testgit 

const verifyToken = async (token) => {
    try {
        const response = await axios.get('/auth/admin/verify-token', { token })
        return response
    } catch (error) {
        console.error("Token verification failed:", error)
        throw error
    }
}

export default { login, verifyToken }