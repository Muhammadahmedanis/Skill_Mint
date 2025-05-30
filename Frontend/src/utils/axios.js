import axios from "axios";
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL1,
    withCredentials: true,
})

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // handle common error globally
        if(error.response){
            if(error.response.status == 401){
                // redirect to login page
                window.location.href = "/";
            }else if (error.response.status === 500){
                console.error("Server error. Please try again later.");
            }
        }else if (error.code === "ECONNABORTED"){
            console.error("Request timeout. Please try again.");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance