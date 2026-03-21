import axios from "axios";

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

export const getAuthTest = async () => {
  const response = await axios.get(`${AUTH_SERVICE_URL}/auth/test`);
  return response.data;
};

export function verifyToken() {
  throw new Error("Not implemented");
}

export const getAuthToken = async (username, password) => {
  try {
    const response = await axios.get(`${AUTH_SERVICE_URL}/auth/login`, {
      params: { username, password },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
