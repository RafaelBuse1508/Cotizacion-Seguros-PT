import { useState } from "react";
import {
    obtenerCotizaciones,
    obtenerCotizacionPorId,
    crearCotizacion,
    actualizarCotizacion,
    cambiarEstadoCotizacion,
} from "../services/cotizacionService";

export const useCotizaciones = () => {
    const [cotizaciones, setCotizaciones] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [filtrosActuales, setFiltrosActuales] = useState({});

    const cargarCotizaciones = async (page = 1, filtros = filtrosActuales) => {
        try {
            const result = await obtenerCotizaciones(page, filtros);
            setCotizaciones(result.data);
            setPaginaActual(result.meta.current_page);
            setTotalPaginas(result.meta.last_page);
            setFiltrosActuales(filtros);
            return {
                success: true,
                data: result,
                mensaje: "Cotizaciones cargadas correctamente",
            };
        } catch (err) {
            console.error("Error cargando cotizaciones:", err);
            return {
                success: false,
                mensaje: err?.message || "Error al cargar cotizaciones",
                error: err,
            };
        }
    };

    const actualizarEstadoLocal = (id, nuevoEstado) => {
        setCotizaciones((prev) =>
            prev.map((cot) =>
                cot.id === id ? { ...cot, estado: nuevoEstado } : cot,
            ),
        );
    };

    const cargarCotizacion = async (id) => {
        try {
            const data = await obtenerCotizacionPorId(id);
            return {
                success: true,
                data,
                mensaje: "Cotización cargada correctamente",
            };
        } catch (err) {
            console.error("Error cargando cotización:", err);
            return {
                success: false,
                mensaje: err?.message || "Error al cargar la cotización",
                error: err,
            };
        }
    };

    const crear = async (formData) => {
        try {
            const response = await crearCotizacion(formData);
            return {
                success: true,
                data: response,
                mensaje: "Cotización creada exitosamente",
            };
        } catch (err) {
            console.error("Error creando cotización:", err);
            return {
                success: false,
                mensaje: err?.message || "Error al crear la cotización",
                error: err,
            };
        }
    };

    const actualizar = async (formData, id) => {
        try {
            const response = await actualizarCotizacion(formData, id);
            return {
                success: true,
                data: response,
                mensaje: "Cotización actualizada exitosamente",
            };
        } catch (err) {
            console.error("Error actualizando cotización:", err);
            return {
                success: false,
                mensaje: err?.message || "Error al actualizar la cotización",
                error: err,
            };
        }
    };

    const cambiarEstado = async (id, estadoNuevo) => {
        try {
            const response = await cambiarEstadoCotizacion(id, estadoNuevo);
            actualizarEstadoLocal(id, estadoNuevo);
            return {
                success: true,
                data: response,
                mensaje: "Estado de cotización actualizado exitosamente",
            };
        } catch (err) {
            console.error("Error actualizando estado cotización:", err);
            return {
                success: false,
                mensaje:
                    err?.message || "Error al actualizar el estado cotización",
                error: err,
            };
        }
    };

    const cambiarPagina = (page) => {
        if (page >= 1 && page <= totalPaginas && page !== paginaActual) {
            return cargarCotizaciones(page, filtrosActuales);
        }
        return { success: false, mensaje: "Página inválida" };
    };

    const recargar = () => cargarCotizaciones(paginaActual, filtrosActuales);

    return {
        cotizaciones,
        paginaActual,
        totalPaginas,
        cargarCotizaciones,
        cambiarPagina,
        recargar,
        cargarCotizacion,
        crear,
        actualizar,
        cambiarEstado,
        actualizarEstadoLocal,
    };
};
