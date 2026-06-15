// v2 - fixed reload loop
import axios, { type AxiosInstance, type AxiosResponse } from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

const http: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
})

// Request interceptor - attach JWT
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle 401, NO hard reload (avoid blank page loop)
http.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const accessToken = localStorage.getItem('access_token')
        const refreshToken = localStorage.getItem('refresh_token')

        if (accessToken && refreshToken) {
          const res = await axios.post(`${BASE_URL}/auth/refresh`, {
            accessToken,
            refreshToken
          })
          if (res.data?.success) {
            const { accessToken: newToken, refreshToken: newRefresh } = res.data.data
            localStorage.setItem('access_token', newToken)
            localStorage.setItem('refresh_token', newRefresh)
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return http(originalRequest)
          }
        }
      } catch {
        // clear tokens, router guard sẽ tự redirect về /login
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
      }
    }

    return Promise.reject(error)
  }
)

export default http
