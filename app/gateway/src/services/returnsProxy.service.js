import axios from 'axios';

const RETURNS_SERVICE_URL = process.env.RETURNS_SERVICE_URL;

const getAllReturns = async () => {
  const response = await axios.get(`${RETURNS_SERVICE_URL}/returns`);
  return response.data;
};

const getReturnById = async (id) => {
  const response = await axios.get(`${RETURNS_SERVICE_URL}/returns/${id}`);
  return response.data;
};

const createReturn = async (newReturn) => {
  const response = await axios.post(`${RETURNS_SERVICE_URL}/returns`, newReturn);
  return response.data;
};

const updateReturn = async (id, updatedData) => {
  const response = await axios.put(`${RETURNS_SERVICE_URL}/returns/${id}`, updatedData);
  return response.data;
};

const deleteReturn = async (id) => {
  const response = await axios.delete(`${RETURNS_SERVICE_URL}/returns/${id}`);
  return response.data;
};

export default {
  getAllReturns,
  getReturnById,
  createReturn,
  updateReturn,
  deleteReturn
};
