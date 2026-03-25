import axios from 'axios';

const ORDERS_SERVICE_URL = process.env.ORDERS_SERVICE_URL;

export const getOrdersTest = async () => {
  try {
    const response = await axios.get(`${ORDERS_SERVICE_URL}/api/orders/health`);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders test:', error);
    throw error;
  }
};
