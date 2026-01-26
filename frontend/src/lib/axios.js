import axios from 'axios'
//have to fix when in production
export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === 'development'
      ? 'http://localhost:3000/api'
      : '/api',
  withCredentials: true,
})
