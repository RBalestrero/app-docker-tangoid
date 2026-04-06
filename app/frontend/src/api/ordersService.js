import axiosClient from './axiosClient';

/* Modelo de filtro:

const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    estado: '',
    tipo_envio_retiro: '',
    plataforma_venta: '',
    ejecutivo_cuenta_id: '',
    numero_remito: '',
    numero_factura: '',
    external_id: '',
    fecha_desde: '',
    fecha_hasta: '',
    created_desde: '',
    created_hasta: '',
    search: '',
  });

  */

export const getOrders = async (params = {}) => {
  try {
    // Limpia parámetros vacíos (clave)
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== undefined && value !== null && value !== ''
      )
    );

    const response = await axiosClient.get('/orders', {
      params: cleanParams,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error.response?.data || error;
  }
};