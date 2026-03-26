import axios from "axios";

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
const USERS_SERVICE_URL = process.env.USERS_SERVICE_URL;

const getAuthTest = async () => {
  const response = await axios.get(`${AUTH_SERVICE_URL}/auth/test`);
  return response.data;
};

function verifyToken() {
  throw new Error("Not implemented");
}

const getAuthToken = async (username, password, nombre, apellido, rol) => {
  try {
    const response = await axios.get(`${AUTH_SERVICE_URL}/auth/login`, {
      params: { username, password, nombre, apellido, rol },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default {
  getAuthTest,
  getAuthToken,
  verifyToken,
};
