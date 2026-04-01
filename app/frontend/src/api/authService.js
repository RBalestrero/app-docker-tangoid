import axiosClient from './axiosClient';

export const loginRequest = async ({ email, password }) => {

  try {
    if (!email || !password) {
      throw new Error('Email y contraseña son requeridos');
    }
    console.log('Login request data:', { email, password: '********' }); // No loguear la contraseña real

  
    const response = await axiosClient.get('/auth/token', {
      params: {
        username: email,
        password,
      }
    });
  
    console.log('Login response:', response.data);
  
    return response.data;
  } catch (error) {
    console.error('Error during login request:', error);
    throw error;
  }    
};

export const verifyRequest = async () => {
  const response = await axiosClient.get('/auth/verify');
  return response.data;
};

export const registerRequest = async (userData) => {
  const response = await axiosClient.post('/users', userData);
  return response.data;
};