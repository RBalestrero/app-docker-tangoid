import service from '../services/authProxy.service.js';

const getAuthToken = async (req, res) => {
  try {

    const { username, password } = req.body;
    console.log('Login attempt:', { username, password });
    const response = await service.getAuthToken(username, password);
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

const testController = async (req, res) => {
  try {
    const data = await service.getAuthTest();
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

const testTokenController = async (req, res) => {
  res.json({
    message: 'Acceso a ruta protegida concedido',
    user: req.user.username,
    password: req.user.password,
  });
};

export default {
  getAuthToken,
  testController,
  testTokenController,
};
