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

async function create(req, res) {
  try {
    const newUser = req.body;
    const createdUser = await usersRepository.create(newUser);
    return res.status(201).json(createdUser);
  } catch (error) {
    console.error('[users.controller][create]', error);
    return res.status(500).json({ message: 'Error al crear usuario' });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedUser = await usersRepository.update(id, updatedData);

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('[users.controller][update]', error);
    return res.status(500).json({ message: 'Error al actualizar usuario' });
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    const deletedUser = await usersRepository.remove(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('[users.controller][remove]', error);
    return res.status(500).json({ message: 'Error al eliminar usuario' });
  }
}

async function getByEmail(req, res) {
  try {
    const { email } = req.params;
    const user = await usersRepository.findByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('[users.controller][getByEmail]', error);
    return res.status(500).json({ message: 'Error al obtener usuario por email' });
  }
}

export default {
  getAll,
  getById,
  create,
  update,
  remove,
  getByEmail,
};