import { getAuthTest, getAuthToken } from '../services/authProxy.service.js';

export const loginController = async (req, res) => {
  try {

    const { username, password } = req.body;
    console.log('Login attempt:', { username, password });
    const response = await getAuthToken(username, password);
    res.status(200).json({
      token: response.token,
    });
  } catch (error) {
    res.status(500).json({
      error: 'No se pudo consultar auth-service',
      detail: error.message,
    });
  }
};

export const testController = async (req, res) => {
  try {
    const data = await getAuthTest();
    res.json({
      gateway: 'ok',
      upstream: data,
    });
  } catch (error) {
    res.status(500).json({
      error: 'No se pudo consultar auth-service',
      detail: error.message,
    });
  }
};

export const testTokenController = async (req, res) => {
  res.json({
    message: 'Acceso a ruta protegida concedido',
    user: req.user.username,
    password: req.user.password,
  });
};
