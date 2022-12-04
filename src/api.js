import axios from "axios"

const baseApiUrl = process.env.REACT_APP_API_URL

const api = axios.create({
    baseURL: baseApiUrl,
    headers: {"Content-Type": "text/plain;charset=UTF-8"}
})

const core = {
    get: (url, config) => api.get(url, config).then(response => response.data),
    put: (url, body, config) => api.put(url, body, config).then(response => response.data),
    post: (url, body, config) => api.post(url, body, config).then(response => response.data)
}

const fireData = {
    predict: (date, rain30d, rain60d, rain90d) => core.post("predict/firedata", {date, rain30d, rain60d, rain90d}),
    allLocations: () => core.post("get_all_locations/firedata", {location_id: "all"})
}

const testing = {
    testEndpoint: () => core.post("default/dantest", null, {params: {
        date: "2022-11-24",
        rain30d: 0.15,
        rain60d: 0.55,
        rain90d: 1.05
    }})
}

export const apiAgent = {
    fireData,
    testing
}