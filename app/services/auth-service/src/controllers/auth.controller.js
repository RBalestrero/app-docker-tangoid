import service from "../services/auth.service.js";

const loginController = async (req, res) => {
  try {
    const { username, password, nombre, apellido, rol } = req.query;
    console.log("Login attempt:", { username, password, nombre, apellido, rol });
    const response = await service.getAuthToken(username, password, nombre, apellido, rol);
    res.status(200).json({
      token: response.token,
    });
  } catch (error) {
    res.status(500).json({
      error: "No se pudo consultar auth-service",
      detail: error.message,
    });
  }
};

export default {
  loginController,
};