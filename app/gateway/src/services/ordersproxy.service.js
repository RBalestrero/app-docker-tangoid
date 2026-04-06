import axios from 'axios';

const ORDERS_SERVICE_URL = process.env.ORDERS_SERVICE_URL;

const getOrdersTest = async () => {
  try {
    const response = await axios.get(`${ORDERS_SERVICE_URL}/health`);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders test:', error);
    throw error;
  }
};

const getOrders = async (query = {}) => {
  try {
    const cleanQuery = Object.fromEntries(
      Object.entries(query).filter(
        ([_, value]) => value !== undefined && value !== null && value !== ''
      )
    );

    const response = await axios.get(
      `${ORDERS_SERVICE_URL}/orders`,
      { params: cleanQuery }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error.response?.data || error;
  }
};

const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${ORDERS_SERVICE_URL}/orders`, orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

const updateOrder = async (id, orderData) => {
  try {
    const response = await axios.put(`${ORDERS_SERVICE_URL}/orders/${id}`, orderData);
    return response.data;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

const deleteOrder = async (id) => {
  try {
    await axios.delete(`${ORDERS_SERVICE_URL}/orders/${id}`);
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

const getOrderById = async (id) => {
  try {
    const response = await axios.get(`${ORDERS_SERVICE_URL}/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    throw error;
  }
};

export default {
  getOrdersTest,
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderById,
};
