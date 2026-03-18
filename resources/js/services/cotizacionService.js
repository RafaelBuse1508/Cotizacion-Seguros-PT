import axios from "axios";

const API_URL = "/api/cotizaciones";

export const obtenerCotizaciones = async (page = 1, filtros = {}) => {
    try {
        const params = {
            page,
            per_page: filtros.per_page || 10,
            ...filtros,
        };

        // console.log(filtros);

        const response = await axios.get(API_URL, { params });

        return {
            data: response.data.data,
            meta: response.data.meta,
            links: response.data.links,
        };
    } catch (error) {
        console.error("Error al obtener cotizaciones:", error);
        throw error;
    }
};

export const crearCotizacion = async (formData) => {
    try {
        const response = await axios.post(API_URL, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data.data;
    } catch (error) {
        console.error("Error al crear cotización:", error);
        console.error("Respuesta backend:", error?.response?.data);
        throw error;
    }
};

export const obtenerCotizacionPorId = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error al obtener cotización ${id}:`, error);
        throw error;
    }
};

export const actualizarCotizacion = async (formData, id) => {
    try {
        const response = await axios.post(`${API_URL}/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data.data;
    } catch (error) {
        console.error(`Error al actualizar cotización ${id}:`, error);
        console.error("Respuesta backend:", error?.response?.data);
        throw error;
    }
};

export const cambiarEstadoCotizacion = async (id, estadoNuevo) => {
    try {
        const response = await axios.patch(`${API_URL}/${id}/estado`, {
            estado_nuevo: estadoNuevo,
        });

        return response.data;
    } catch (error) {
        console.error(`Error al cambiar estado de cotización ${id}:`, error);
        console.error("Respuesta backend:", error?.response?.data);
        throw error;
    }
};
