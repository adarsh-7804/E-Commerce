import axiosInstance from "./axiosInstance";

export const createOrder = async (orderData) => {
  const response = await axiosInstance.post("/orders/create", orderData);
  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await axiosInstance.get(`/orders/${orderId}`);
  return response.data;
};

export const getUserOrders = async () => {
  const response = await axiosInstance.get("/orders/my-orders");
  return response.data;
};
