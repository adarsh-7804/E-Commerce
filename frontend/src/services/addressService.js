import axiosInstance from "./axiosInstance";

// Add a new address
export const addAddressAPI = async (addressData) => {
    const response = await axiosInstance.post("/addresses", addressData);
    return response.data;
}

// Get all addresses for the user
export const getUserAddressesAPI = async () => {
    const response = await axiosInstance.get("/addresses");
    return response.data;
}

// Get a single address by ID
export const getAddressByIdAPI = async (addressId) => {
    const response = await axiosInstance.get(`/addresses/${addressId}`);
    return response.data;
}

// Update an address
export const updateAddressAPI = async (addressId, addressData) => {
    const response = await axiosInstance.put(`/addresses/${addressId}`, addressData);
    return response.data;
}

// Delete an address
export const deleteAddressAPI = async (addressId) => {
    const response = await axiosInstance.delete(`/addresses/${addressId}`);
    return response.data;
}

// Set default address
export const setDefaultAddressAPI = async (addressId) => {
    const response = await axiosInstance.patch(`/addresses/${addressId}/set-default`);
    return response.data;
}
