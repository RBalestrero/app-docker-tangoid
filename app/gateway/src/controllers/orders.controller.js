import { getOrdersTest } from '../services/ordersProxy.service.js';

export const getOrdersTestController = async (req, res) => {
  try {
    const response = await getOrdersTest();
    res.json(response);
  } catch (error) {
    console.error('Error fetching orders test:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
