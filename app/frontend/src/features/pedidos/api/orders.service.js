import axiosClient from '../../../api/axiosClient';

export const getOrders = async (params = {}) => {
  try {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== undefined && value !== null && value !== ''
      )
    );

    const response = await axiosClient.get('/orders', {
      params: cleanParams,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error.response?.data || error;
  }
};

export const createOrder = async (payload) => {
  try {
    const response = await axiosClient.post('/orders', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error.response?.data || error;
  }
};

export const updateOrderStatus = async (orderId, estado) => {
  try {
    const response = await axiosClient.patch(`/orders/${orderId}/status`, {
      estado,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error.response?.data || error;
  }
};