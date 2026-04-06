import ordersRepository from '../repositories/orders.repository.js';

const allowedStates = ['Precarga', 'Preparando', 'Hecho', 'Despachado'];

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

function validateEstado(estado) {
  if (estado === undefined || estado === null || estado === '') {
    return null;
  }

  if (!allowedStates.includes(estado)) {
    return {
      message: 'Estado inválido',
      allowedStates,
    };
  }

  return null;
}

async function getAll(req, res) {
  try {
    const {
      page = '1',
      limit = '20',
      estado,
      tipo_envio_retiro,
      plataforma_venta,
      ejecutivo_cuenta_id,
      numero_remito,
      numero_factura,
      external_id,
      fecha_desde,
      fecha_hasta,
      created_desde,
      created_hasta,
      search,
    } = req.query;

    const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

    const rawFilters = {
      estado,
      tipo_envio_retiro,
      plataforma_venta,
      ejecutivo_cuenta_id,
      numero_remito,
      numero_factura,
      external_id,
      fecha_desde,
      fecha_hasta,
      created_desde,
      created_hasta,
      search,
      page: parsedPage,
      limit: parsedLimit,
    };

    const filters = Object.fromEntries(
      Object.entries(rawFilters).filter(([_, value]) => value !== undefined && value !== null && value !== '')
    );

    const result = await ordersRepository.getAll(filters);

    return res.status(200).json(result);
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

    const estadoError = validateEstado(req.body.estado);
    if (estadoError) {
      return res.status(400).json(estadoError);
    }

    const created = await ordersRepository.create(req.body);
    return res.status(201).json(created);
  } catch (error) {
    console.error('[orders.controller][create]', error);

    if (error.code === '23503') {
      return res.status(400).json({
        message: 'Uno de los user_id enviados no existe en users',
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

    const estadoError = validateEstado(req.body.estado);
    if (estadoError) {
      return res.status(400).json(estadoError);
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
        message: 'Uno de los user_id enviados no existe en users',
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

    return res.status(200).json({
      message: 'Pedido eliminado',
      id: deleted.id,
    });
  } catch (error) {
    console.error('[orders.controller][remove]', error);
    return res.status(500).json({ message: 'Error al eliminar pedido' });
  }
}

export default {
  getAll,
  getById,
  create,
  update,
  remove,
};