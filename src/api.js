import axios from "axios"

// Specify in .env.local to use in dev environment
const baseApiUrl = process.env.REACT_APP_API_URL

const api = axios.create({
    baseURL: baseApiUrl,
    headers: {"Content-Type": "text/plain;charset=UTF-8"} // Required to prevent 500 error on api
})

// Core request functionality
const core = {
    get: (url, config) => api.get(url, config).then(response => response.data),
    put: (url, body, config) => api.put(url, body, config).then(response => response.data),
    post: (url, body, config) => api.post(url, body, config).then(response => response.data)
}

// fireData endpoints
const fireData = {
    predict: (date, rain30d, rain60d, rain90d) => core.post("predict/firedata", {date, rain30d, rain60d, rain90d}),
    allLocations: () => core.post("get_all_locations/firedata", {location_id: "all"})
}

export const apiAgent = {
    fireData
}