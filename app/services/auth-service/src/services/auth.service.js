import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export function getAuthTest() {
  return {
    service: 'auth-service',
    status: 'ok',
  };
}

export function getAuthToken(username, password) {
  const token = jwt.sign({ username, password }, JWT_SECRET);
  return {
    token,
  };
}