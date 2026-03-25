import usersRepository from '../repositories/users.repository.js';

async function getAll(req, res) {
  try {
    const users = await usersRepository.getAll();
    return res.status(200).json(users);
  } catch (error) {
    console.error('[users.controller][getAll]', error);
    return res.status(500).json({ message: 'Error al obtener usuarios' });
  }
}

async function getById(req, res) {
  try {
    const { id } = req.params;
    const user = await usersRepository.getById(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('[users.controller][getById]', error);
    return res.status(500).json({ message: 'Error al obtener usuario' });
  }
}

export default {
  getAll,
  getById,
};