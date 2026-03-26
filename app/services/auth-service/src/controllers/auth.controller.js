import { getAuthTest, getAuthToken } from "../services/auth.service.js";

export const loginController = async (req, res) => {
  try {
    const { username, password } = req.query;
    console.log("Login attempt:", { username, password });
    const response = await getAuthToken(username, password);
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
