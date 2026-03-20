import axios from 'axios';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

export const getAuthTest = async () => {
  const response = await axios.get(`${AUTH_SERVICE_URL}/auth/test`);
  return response.data;
};