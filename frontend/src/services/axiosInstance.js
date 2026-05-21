// import axios from "axios";

// const axiosInstance = axios.create({
//     baseURL: "http://localhost:5000/api",
// })

// axiosInstance.interceptors.request.use(
//     (config) => {
//         const storedUser = localStorage.getItem("user");
//         const user = storedUser ? JSON.parse(storedUser) : null;

//         if (user?.token) {
//             config.headers.Authorization = `Bearer ${user.token}`;
//         }

//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// export default axiosInstance;


import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://e-commerce-a2ab.onrender.com/api",
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;

        if (user?.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;