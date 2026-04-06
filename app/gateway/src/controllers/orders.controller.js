import ordersService from '../services/ordersProxy.service.js';

const getOrdersTestController = async (req, res) => {
  try {
    const response = await ordersService.getOrdersTest();
    res.json(response);
  } catch (error) {
    console.error('Error fetching orders test:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await ordersService.getOrderById(id);
    res.json(response);
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getOrders = async (req, res) => {
  try {
    const response = await ordersService.getOrders(req.query);
    res.json(response);
  } catch (error) {
    console.error('Error fetching orders:', error);

    const status = error.status || error.response?.status || 500;
    const message =
      error.message ||
      error.response?.data?.message ||
      'Internal Server Error';

    res.status(status).json({ error: message });
  }
};

const createOrder = async (req, res) => {
  try {
    const newOrder = req.body;
    const response = await ordersService.createOrder(newOrder);
    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedOrder = req.body;
    const response = await ordersService.updateOrder(id, updatedOrder);
    res.json(response);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await ordersService.deleteOrder(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default {
  getOrders,
  getOrdersTestController,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderById,
};
