import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

function getAuthTest() {
  return {
    service: 'auth-service',
    status: 'ok',
  };
}

function getAuthToken(username, password, nombre, apellido, rol ) {
  const token = jwt.sign({ username, password, nombre, apellido, rol }, JWT_SECRET);
  return {
    token,
  };
}

export default {
  getAuthTest,
  getAuthToken,
};