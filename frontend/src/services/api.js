import axios from "axios";

const API = axios.create({
    baseURL: [
            "http://localhost:5000/api",
            "https://ai-travel-planner-api-6hxk.onrender.com/api"
        ],
    withCredentials: true,
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");

    if(token){
        req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
});

export default API;