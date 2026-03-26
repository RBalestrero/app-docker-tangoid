import returnsRepository from "../repositories/returns.repository.js";

async function getAllReturns(req, res) {
  try {
    const returns = await returnsRepository.findAll();
    res.json(returns);
  } catch (error) {
    console.error("Error fetching returns:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getReturnById(req, res) {
  const { id } = req.params;
  try {
    const returnItem = await returnsRepository.findById(id);
    if (!returnItem) {
      return res.status(404).json({ error: "Return not found" });
    }
    res.json(returnItem);
  } catch (error) {
    console.error("Error fetching return by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function createReturn(req, res) {
  const newReturn = req.body;
  try {
    const createdReturn = await returnsRepository.create(newReturn);
    res.status(201).json(createdReturn);
  } catch (error) {
    console.error("Error creating return:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function updateReturn(req, res) {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const updatedReturn = await returnsRepository.update(id, updatedData);
    if (!updatedReturn) {
      return res.status(404).json({ error: "Return not found" });
    }
    res.json(updatedReturn);
  } catch (error) {
    console.error("Error updating return:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function deleteReturn(req, res) {
  const { id } = req.params;
  try {
    const deleted = await returnsRepository.delete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Return not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting return:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export default {
  getAllReturns,
  getReturnById,
  createReturn,
  updateReturn,
  deleteReturn
};
