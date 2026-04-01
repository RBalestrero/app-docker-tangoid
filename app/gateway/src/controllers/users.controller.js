import usersService from '../services/usersProxy.service.js';

const getUsers = async (req, res) => {
  try {
    const response = await usersService.getUsers();
    res.json(response);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await usersService.getUserById(id);
    res.json(response);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createUser = async (req, res) => {
  try {
    const newUser = req.body;
    console.log('Creating user with data (gateway):', newUser);
    const response = await usersService.createUser(newUser);
    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(error.response?.status || 500).json({ error: error.response?.data || { error: 'Internal Server Error' } });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = req.body;
    const response = await usersService.updateUser(id, updatedUser);
    res.json(response);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await usersService.deleteUser(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
