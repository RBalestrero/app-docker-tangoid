import axios from 'axios';

const ORDERS_SERVICE_URL = process.env.ORDERS_SERVICE_URL;

export const getOrdersTest = async () => {
  try {
    const response = await axios.get(`${ORDERS_SERVICE_URL}/health`);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders test:', error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await axios.get(`${ORDERS_SERVICE_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders users:', error);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const response = await axios.get(`${ORDERS_SERVICE_URL}/orders`);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};
