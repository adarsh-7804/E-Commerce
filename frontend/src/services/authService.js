import axiosInstance from "./axiosInstance";

export const registerUserAPI = async (userData) => {
    const response = await axiosInstance.post("/auth/register", userData);

    return response.data;
}
export const sendPasswordSetupEmailAPI = async (email) => {
    const response = await axiosInstance.post("/auth/send-password-setup", { email });
    return response.data;
}

export const setPasswordAPI = async (data) => {
    const response = await axiosInstance.post("/auth/set-password", data);
    return response.data;
}

export const verifyPasswordSetupTokenAPI = async (token) => {
    const response = await axiosInstance.post("/auth/verify-password-token", { token });
    return response.data;
}

export const loginUserAPI = async (userData) => {
    const response = await axiosInstance.post("/auth/login", userData);

    return response.data;
}

export const verifyOTPAPI = async (otpData) => {
    const response = await axiosInstance.post("/auth/verify-otp", otpData);

    return response.data;
}

export const resendOTPAPI = async (userId) => {
    const response = await axiosInstance.post("/auth/resend-otp", { userId });

    return response.data;
}

export const setRoleAPI = async (roleData) => {
    const response = await axiosInstance.post("/auth/set-role", roleData);

    return response.data;
}

export const logoutUserAPI = async () => {
    const response = await axiosInstance.post("/auth/logout");

    return response.data;
}

export const forgotPasswordAPI = async (email) => {
    const response = await axiosInstance.post("/auth/forgot-password", { email });
    return response.data;
}

