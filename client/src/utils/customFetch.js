import axios from 'axios';
const BASE_URL =
    import.meta.env.VITE_BASE_URL;

const customFetch = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // This makes Axios include cookies with each request
});

//Handling error globally
customFetch.interceptors.response.use(
    (response) => response,
    (error) => {
        let errorMessage = "Unknown error occurred";

        if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        } else if (error.message) {
            errorMessage = error.message;
        }

        console.error("API Error:", errorMessage);
        return Promise.reject(error);
    }
);
export default customFetch;