export const getOrdersHealthController = async (req, res) => {
  try {
    res.json({ status: 'ok', service: 'orders-service', message: 'Orders service is healthy' });
  } catch (error) {
    console.error('Error fetching orders health:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
