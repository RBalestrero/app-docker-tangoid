import service from '../services/returnsProxy.service.js';

const getAllReturns = async (req, res) => {
  try {
    const returns = await service.getAllReturns();
    res.json(returns);
  } catch (error) {
    console.error('Error fetching returns:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getReturnById = async (req, res) => {
  const { id } = req.params;
  try {
    const returnItem = await service.getReturnById(id);
    if (!returnItem) {
      return res.status(404).json({ error: 'Return not found' });
    }
    res.json(returnItem);
  } catch (error) {
    console.error('Error fetching return by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createReturn = async (req, res) => {
  const newReturn = req.body;
  try {
    const createdReturn = await service.createReturn(newReturn);
    res.status(201).json(createdReturn);
  } catch (error) {
    console.error('Error creating return:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateReturn = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const updatedReturn = await service.updateReturn(id, updatedData);
    if (!updatedReturn) {
      return res.status(404).json({ error: 'Return not found' });
    }
    res.json(updatedReturn);
  } catch (error) {
    console.error('Error updating return:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteReturn = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await service.deleteReturn(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Return not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting return:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default {
  getAllReturns,
  getReturnById,
  createReturn,
  updateReturn,
  deleteReturn
};
