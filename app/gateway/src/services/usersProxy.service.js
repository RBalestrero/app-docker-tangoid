import axios from 'axios';

const USERS_SERVICE_URL = process.env.USERS_SERVICE_URL;

const getUsers = async () => {
  try {
    const response = await axios.get(`${USERS_SERVICE_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

const getUserById = async (id) => {
  try {
    const response = await axios.get(`${USERS_SERVICE_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
};

const createUser = async (userData) => {
  try {
    console.log("DATOS DE USUARIO A CREAR: ",userData);
    const response = await axios.post(`${USERS_SERVICE_URL}/users`, userData);
    console.log("DATOS DE USUARIO CREADO: ", response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

const updateUser = async (id, userData) => {
  try {
    const response = await axios.put(`${USERS_SERVICE_URL}/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

const deleteUser = async (id) => {
  try {
    await axios.delete(`${USERS_SERVICE_URL}/users/${id}`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

const getUserByEmail = async (email) => {
  try {
    console.log("EMAIL PARA BUSCAR USUARIO: ", email);
    const response = await axios.get(`${USERS_SERVICE_URL}/users/email/${email}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
};

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
};
