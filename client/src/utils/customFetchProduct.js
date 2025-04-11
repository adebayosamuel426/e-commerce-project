import axios from 'axios';
const BASE_URL =
    import.meta.env.VITE_BASE_URL;

const customFetchProduct = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "multipart/form-data"
    },
    withCredentials: true,
});

//Handling error globally
customFetchProduct.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", (error.message));
        return Promise.reject(error);
    }
);
export default customFetchProduct;