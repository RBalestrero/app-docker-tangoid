import ordersRepository from '../repositories/orders.repository.js';

export const getOrdersHealthController = async (req, res) => {
  try {
    res.json({ status: 'ok', service: 'orders-service', message: 'Orders service is healthy' });
  } catch (error) {
    console.error('Error fetching orders health:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


function validateRequiredFields(body) {
  const requiredFields = [
    'fecha',
    'razon_social',
    'ejecutivo_cuenta_id',
    'plataforma_venta',
    'numero_remito',
    'numero_factura',
    'tipo_envio_retiro',
  ];

  const missing = requiredFields.filter((field) => {
    const value = body[field];
    return value === undefined || value === null || value === '';
  });

  return missing;
}

async function getAll(req, res) {
  try {
    const orders = await ordersRepository.getAll();
    return res.status(200).json(orders);
  } catch (error) {
    console.error('[orders.controller][getAll]', error);
    return res.status(500).json({ message: 'Error al obtener pedidos' });
  }
}

async function getById(req, res) {
  try {
    const { id } = req.params;
    const order = await ordersRepository.getById(id);

    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error('[orders.controller][getById]', error);
    return res.status(500).json({ message: 'Error al obtener pedido' });
  }
}

async function create(req, res) {
  try {
    const missing = validateRequiredFields(req.body);

    if (missing.length) {
      return res.status(400).json({
        message: 'Faltan campos obligatorios',
        missing,
      });
    }

    const created = await ordersRepository.create(req.body);
    return res.status(201).json(created);
  } catch (error) {
    console.error('[orders.controller][create]', error);

    if (error.code === '23503') {
      return res.status(400).json({
        message: 'El ejecutivo_cuenta_id no existe en users',
      });
    }

    return res.status(500).json({ message: 'Error al crear pedido' });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const missing = validateRequiredFields(req.body);

    if (missing.length) {
      return res.status(400).json({
        message: 'Faltan campos obligatorios',
        missing,
      });
    }

    const updated = await ordersRepository.update(id, req.body);

    if (!updated) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    return res.status(200).json(updated);
  } catch (error) {
    console.error('[orders.controller][update]', error);

    if (error.code === '23503') {
      return res.status(400).json({
        message: 'El ejecutivo_cuenta_id no existe en users',
      });
    }

    return res.status(500).json({ message: 'Error al actualizar pedido' });
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    const deleted = await ordersRepository.remove(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    return res.status(200).json({ message: 'Pedido eliminado', id: deleted.id });
  } catch (error) {
    console.error('[orders.controller][remove]', error);
    return res.status(500).json({ message: 'Error al eliminar pedido' });
  }
}

export default {
  getOrdersHealthController,
  getAll,
  getById,
  create,
  update,
  remove,
};
