import axios from "axios"
const AUTH_EXCLUDED_URLS = [
  "/api/token/",
  "/api/token/refresh/",
  "/api/logout/",
  "/api/user/",
]

/* ================================
   Axios instance
================================ */
// Esto usamos inicialmente
// const react_url = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : "no hay base"

// se cambio a esto para probar desde adnroid emulator
const isAndroidEmulator =
  window.location.hostname === "10.0.2.2" ||
  navigator.userAgent.includes("Android")

const react_url = isAndroidEmulator
  ? "http://10.0.2.2:8000"
  : "http://localhost:8000"



const api = axios.create({
  baseURL: react_url,
  headers: {
    "Content-Type": "application/json",
  },
})

/* ================================
   Helpers refresh queue
================================ */
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

/* ================================
   Logout helper
   (inyecta desde AuthContext si quieres)
================================ */
export const logout = () => {
  localStorage.removeItem("access")
  localStorage.removeItem("refresh")
  window.location.href = "/login"
}

/* ================================
   REQUEST interceptor
   → agrega access token
================================ */
api.interceptors.request.use(
  config => {
    const access = localStorage.getItem("access")
    if (access) {
      config.headers.Authorization = `Bearer ${access}`
    }
    return config
  },
  error => Promise.reject(error)
)

/* ================================
   RESPONSE interceptor
   → refresh automático
================================ */
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    // No response (network error)
    if (!error.response) {
      return Promise.reject(error)
    }

    // No es 401 → error normal
    // if (error.response.status !== 401) {
    //   return Promise.reject(error)
    // }
    const requestUrl = originalRequest.url

    if (
      error.response.status !== 401 ||
      AUTH_EXCLUDED_URLS.some(url => requestUrl.includes(url))
    ) {
      return Promise.reject(error)
    }


    // Si falló el refresh → logout
    if (originalRequest.url.includes("/api/token/refresh/")) {
      logout()
      return Promise.reject(error)
    }

    // Evitar loop infinito
    if (originalRequest._retry) {
      return Promise.reject(error)
    }
    originalRequest._retry = true

    // Si ya hay refresh en curso → esperar
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: token => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(api(originalRequest))
          },
          reject,
        })
      })
    }

    isRefreshing = true

    try {
      const refresh = localStorage.getItem("refresh")
      if (!refresh) {
        logout()
        return Promise.reject(error)
      }

      const res = await api.post("/api/token/refresh/", { refresh })
      const newAccess = res.data.access

      localStorage.setItem("access", newAccess)
      api.defaults.headers.Authorization = `Bearer ${newAccess}`

      processQueue(null, newAccess)

      originalRequest.headers.Authorization = `Bearer ${newAccess}`
      return api(originalRequest)

    } catch (err) {
      processQueue(err, null)
      logout()
      return Promise.reject(err)

    } finally {
      isRefreshing = false
    }
  }
)

export default api
