import { getUsers } from '../services/usersProxy.service.js';

export const getUsersController = async (req, res) => {
  try {
    const response = await getUsers();
    res.json(response);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};