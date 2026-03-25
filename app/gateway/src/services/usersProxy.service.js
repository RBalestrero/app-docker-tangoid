import axios from 'axios';

const USERS_SERVICE_URL = process.env.USERS_SERVICE_URL;

export const getUsers = async () => {
  try {
    const response = await axios.get(`${USERS_SERVICE_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};