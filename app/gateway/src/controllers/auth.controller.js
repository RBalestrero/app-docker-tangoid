import authService from '../services/authProxy.service.js';
import usersService from '../services/usersProxy.service.js';

const getAuthToken = async (req, res) => {
  try {

    const { username, password } = req.query;
    console.log('Auth request body:', req.query);
    console.log('Received auth request for username:', username);

    const userInfo = await usersService.getUserByEmail(username);

    if (!userInfo) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const response = await authService.getAuthToken(username, password, userInfo.nombre, userInfo.apellido, userInfo.rol);
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
    const data = await authService.getAuthTest();
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
    nombre: req.user.nombre,
    apellido: req.user.apellido,
    rol: req.user.rol,
  });
};

export default {
  getAuthToken,
  testController,
  testTokenController,
};
