import axios from 'axios';

const INVENTORY_SERVICE_URL = process.env.INVENTORY_SERVICE_URL;

export const getInventoryTest = async () => {
  const response = await axios.get(`${INVENTORY_SERVICE_URL}/inventory/test`);
  return response.data;
};