import axiosInstance  from "./axiosInstance";

export const createPaymentIntentAPI = async (items, totalAmount) => {
    try {
        console.log('Sending payment intent request:', { items, totalAmount });
        const response = await axiosInstance.post("/payments/create-payment-intent", {
            items,
            totalAmount,
        })
        console.log('Payment intent response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Payment intent error:', error.response?.data || error.message);
        throw error.response?.data || error;
    }
}

export const confirmPayment = async (paymentIntentId, address, subtotal, discount, shipping, totalAmount) => {
    try {
        const response = await axiosInstance.post("/payments/confirm-payment", {
            paymentIntentId,
            address,
            subtotal,
            discount,
            shipping,
            totalAmount,
        })
        return response.data;
    } catch (error) {
        console.error('Confirm payment error:', error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

export const getPaymentStatus = async (paymentIntentId) => {
    try {
        const response = await axiosInstance.get(`/payments/payment-status/${paymentIntentId}`);
        return response.data;
    } catch (error) {
        console.error('Get payment status error:', error.response?.data || error.message);
        throw error.response?.data || error;
    }
}
