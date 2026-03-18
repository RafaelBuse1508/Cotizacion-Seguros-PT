import { useEffect, useState } from "react";
import { useCotizaciones } from "../hooks/useCotizaciones";
import Tabla from "../components/Tabla";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import Toast from "../components/Toast";

export default function ListaCotizaciones() {
    const [filtros, setFiltros] = useState({
        estado: "",
        cliente: "",
        desde: "",
        hasta: "",
        per_page: 10,
    });

    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);
    const [mensaje, setMensaje] = useState("");

    const {
        cotizaciones,
        paginaActual,
        totalPaginas,
        cargarCotizaciones,
        cargarCotizacion,
        cambiarEstado,
    } = useCotizaciones();

    const handleVerDetalles = async (id) => {
        try {
            const resultado = await cargarCotizacion(id);
            if (resultado.success) {
                return resultado.data;
            }
            return null;
        } catch (error) {
            console.error("Error al cargar detalles:", error);
            return null;
        }
    };

    const handleCambiarEstado = async (id, data) => {
        try {
            const resultado = await cambiarEstado(id, data.estado);
            if (resultado.success) {
                setMensaje(
                    "Estado actualizado correctamente, se notificara por correo",
                );
                return resultado;
            } else {
                return resultado;
            }
        } catch (error) {
            console.error("Error al cambiar estado:", error);
            return {
                success: false,
                mensaje: error?.message || "Error al cambiar el estado",
            };
        }
    };

    const columns = [
        {
            key: "cliente_nombre",
            label: "Cliente",
            render: (row) => row.cliente?.nombre || "N/A",
        },
        {
            key: "cliente_cedula",
            label: "Cédula",
            render: (row) => row.cliente?.cedula || "N/A",
        },
        {
            key: "cliente_correo",
            label: "Correo",
            render: (row) => row.cliente?.correo || "N/A",
        },
        { key: "marca", label: "Marca" },
        { key: "modelo", label: "Modelo" },
        { key: "anio", label: "Año" },
        {
            key: "fecha_ingreso",
            label: "Fecha",
            render: (row) => row.fecha_ingreso,
        },
        {
            key: "prima",
            label: "Precio Estimado",
            render: (row) => (row.prima ? `$${row.prima}` : "N/A"),
        },
        {
            key: "estado",
            label: "Estado",
            render: (row) => (
                <span
                    className={`px-2 py-1 rounded text-xs font-semibold
                    ${row.estado === "pendiente" ? "bg-yellow-200 text-yellow-900" : ""}
                    ${row.estado === "en revision" ? "bg-blue-200 text-blue-900" : ""}
                    ${row.estado === "aprobado" ? "bg-green-200 text-green-900" : ""}
                    ${row.estado === "rechazado" ? "bg-red-200 text-red-900" : ""}
                    ${row.estado === "cerrado" ? "bg-gray-300 text-gray-900" : ""}
                `}
                >
                    {row.estado || "Pendiente"}
                </span>
            ),
        },
    ];

    const cargarDatos = async (page = 1, filtrosData = filtros) => {
        setCargando(true);
        setError(null);
        try {
            const resultado = await cargarCotizaciones(page, filtrosData);
            if (!resultado.success) {
                setError(resultado.mensaje);
            }
        } catch (err) {
            setError(err?.message || "Error al cargar las cotizaciones");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarDatos(1, filtros);
    }, []);

    const aplicarFiltros = async () => {
        await cargarDatos(1, filtros);
    };

    const limpiarFiltros = async () => {
        const filtrosLimpios = {
            estado: "",
            cliente: "",
            desde: "",
            hasta: "",
            per_page: 10,
        };
        setFiltros(filtrosLimpios);
        await cargarDatos(1, filtrosLimpios);
    };

    const handleCambiarPagina = async (page) => {
        if (page >= 1 && page <= totalPaginas) {
            await cargarDatos(page, filtros);
        }
    };

    if (error) {
        return (
            <div className="p-4">
                <div className="bg-red-200 border border-red-400 text-red-900 p-3 rounded">
                    <p className="font-bold mb-1">Error</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Lista de Cotizaciones</h1>

            <Toast
                mensaje={mensaje}
                color={"green"}
                onClose={() => setMensaje("")}
            />

            <div className="mb-4">
                <div className="flex flex-wrap gap-3 items-center mb-3">
                    <input
                        type="text"
                        placeholder="Buscar cliente"
                        value={filtros.cliente}
                        onChange={(e) =>
                            setFiltros({ ...filtros, cliente: e.target.value })
                        }
                        className="border border-gray-400 rounded px-3 py-2 w-64"
                    />

                    <select
                        value={filtros.estado}
                        onChange={(e) =>
                            setFiltros({ ...filtros, estado: e.target.value })
                        }
                        className="border border-gray-400 rounded px-3 py-2 bg-white"
                    >
                        <option value="">Todos los estados</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="en revision">En revisión</option>
                        <option value="aprobado">Aprobado</option>
                        <option value="rechazado">Rechazado</option>
                        <option value="cerrado">Cerrado</option>
                    </select>

                    <div className="flex items-center gap-2">
                        <label className="text-gray-800">Desde:</label>
                        <input
                            type="date"
                            value={filtros.desde}
                            onChange={(e) =>
                                setFiltros({
                                    ...filtros,
                                    desde: e.target.value,
                                })
                            }
                            className="border border-gray-400 rounded px-3 py-2"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-gray-800">Hasta:</label>
                        <input
                            type="date"
                            value={filtros.hasta}
                            onChange={(e) =>
                                setFiltros({
                                    ...filtros,
                                    hasta: e.target.value,
                                })
                            }
                            className="border border-gray-400 rounded px-3 py-2"
                        />
                    </div>
                </div>

                <div className="flex gap-3 items-center justify-between">
                    <div className="flex gap-3">
                        <button
                            onClick={aplicarFiltros}
                            disabled={cargando}
                            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                        >
                            Buscar
                        </button>

                        <button
                            onClick={limpiarFiltros}
                            disabled={cargando}
                            className="bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50"
                        >
                            Limpiar filtros
                        </button>
                    </div>

                    <Link
                        to="/cotizaciones/crear"
                        className="bg-green-700 text-white px-4 py-2 rounded inline-block"
                    >
                        + Crear cotización
                    </Link>
                </div>
            </div>

            {cargando ? (
                <Loading />
            ) : (
                <>
                    <Tabla
                        columns={columns}
                        data={cotizaciones}
                        onVerDetalles={handleVerDetalles}
                        onCambiarEstado={handleCambiarEstado}
                    />

                    {totalPaginas > 1 && (
                        <div className="flex justify-center items-center gap-3 mt-4">
                            <button
                                onClick={() =>
                                    handleCambiarPagina(paginaActual - 1)
                                }
                                disabled={paginaActual <= 1 || cargando}
                                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                            >
                                Anterior
                            </button>
                            <span className="text-gray-800">
                                Página {paginaActual} de {totalPaginas}
                            </span>
                            <button
                                onClick={() =>
                                    handleCambiarPagina(paginaActual + 1)
                                }
                                disabled={
                                    paginaActual >= totalPaginas || cargando
                                }
                                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
