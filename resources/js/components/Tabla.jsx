import { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "./Modal";
import CambiarEstadoModal from "./CambiarEstadoModal";
import Loading from "./Loading";



export default function Tabla({
    columns,
    data,
    onVerDetalles,
    onCambiarEstado,
}) {
    const [modalAbierto, setModalAbierto] = useState(false);
    const [modalEstadoAbierto, setModalEstadoAbierto] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [detalles, setDetalles] = useState(null);
    const [cargando, setCargando] = useState(false);

    const handleVer = async (row) => {
        setSelectedRow(row);
        setModalAbierto(true);
        setCargando(true);
        setDetalles(null);

        try {
            if (onVerDetalles) {
                const resultado = await onVerDetalles(row.id);
                setDetalles(resultado);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setCargando(false);
        }
    };

    const handleCerrar = () => {
        setModalAbierto(false);
        setSelectedRow(null);
        setDetalles(null);
    };

    return (
        <>
            <div className="border rounded-lg overflow-hidden overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className="px-4 py-2 text-left text-sm"
                                >
                                    {col.label}
                                </th>
                            ))}
                            <th className="px-4 py-2 text-left text-sm">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + 1}
                                    className="px-4 py-8 text-center text-gray-500"
                                >
                                    No hay datos
                                </td>
                            </tr>
                        ) : (
                            data.map((row, i) => (
                                <tr
                                    key={row.id || i}
                                    className="border-t hover:bg-gray-50"
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={col.key}
                                            className="px-4 py-2 text-sm"
                                        >
                                            {col.render
                                                ? col.render(row)
                                                : row[col.key]}
                                        </td>
                                    ))}
                                    <td className="px-4 py-2">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleVer(row)}
                                                className="px-2 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                                            >
                                                Ver
                                            </button>
                                            <Link
                                                to={`/cotizaciones/${row.id}/editar`}
                                                className="px-2 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setSelectedRow(row);
                                                    setModalEstadoAbierto(true);
                                                }}
                                                className="px-2 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                                            >
                                                Estado
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {modalAbierto && (
                <Modal
                    isOpen={modalAbierto}
                    onClose={handleCerrar}
                    title="Detalles de la Cotización"
                >
                    {cargando ? (
                        <Loading />
                    ) : (
                        detalles && (
                            <div className="space-y-5 text-sm text-gray-700">
              
                                <div className="border-b pb-4">
                                    <h3 className="mb-3 text-base font-semibold text-gray-800">
                                        Cliente
                                    </h3>
                                    <div className="space-y-2">
                                        <p>
                                            <span className="font-medium text-gray-600">
                                                Nombre:
                                            </span>{" "}
                                            {detalles.cliente?.nombre ||
                                                detalles.nombre}
                                        </p>
                                        <p>
                                            <span className="font-medium text-gray-600">
                                                Cédula:
                                            </span>{" "}
                                            {detalles.cliente?.cedula ||
                                                detalles.cedula}
                                        </p>
                                        <p>
                                            <span className="font-medium text-gray-600">
                                                Correo:
                                            </span>{" "}
                                            {detalles.cliente?.correo ||
                                                detalles.correo}
                                        </p>
                                    </div>
                                </div>

                                <div className="border-b pb-4">
                                    <h3 className="mb-3 text-base font-semibold text-gray-800">
                                        Vehículo
                                    </h3>
                                    <div className="space-y-2">
                                        <p>
                                            <span className="font-medium text-gray-600">
                                                Marca:
                                            </span>{" "}
                                            {detalles.marca}
                                        </p>
                                        <p>
                                            <span className="font-medium text-gray-600">
                                                Modelo:
                                            </span>{" "}
                                            {detalles.modelo}
                                        </p>
                                        <p>
                                            <span className="font-medium text-gray-600">
                                                Año:
                                            </span>{" "}
                                            {detalles.anio}
                                        </p>
                                        <p>
                                            <span className="font-medium text-gray-600">
                                                Prima:
                                            </span>{" "}
                                            ${detalles.prima}
                                        </p>
                                    </div>
                                </div>

                                <div className="border-b pb-4">
                                    <h3 className="mb-3 text-base font-semibold text-gray-800">
                                        Estado
                                    </h3>
                                    <span className="inline-block rounded bg-gray-100 px-3 py-1 text-sm text-gray-700">
                                        {detalles.estado || "Pendiente"}
                                    </span>
                                </div>

                                {detalles.documentos?.length > 0 && (
                                    <div className="border-b pb-4">
                                        <h3 className="mb-3 text-base font-semibold text-gray-800">
                                            Documentos
                                        </h3>
                                        <div className="space-y-2">
                                            {detalles.documentos.map(
                                                (doc, i) => (
                                                    <a
                                                        key={i}
                                                        href={`${import.meta.env.VITE_API_URL}/storage/${doc.ruta}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="block text-sm text-blue-600 hover:underline"
                                                    >
                                                        {doc.nombre}
                                                    </a>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}

                                {detalles.historia_estados?.length > 0 && (
                                    <div className="pb-4">
                                        <h3 className="mb-3 text-base font-semibold text-gray-800">
                                            Historial
                                        </h3>

                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-gray-700 border border-gray-200">
                                                <thead className="bg-gray-100">
                                                    <tr>
                                                        <th className="px-3 py-2 text-left border-b border-gray-200">
                                                            Estado Anterior
                                                        </th>
                                                        <th className="px-3 py-2 text-left border-b border-gray-200">
                                                            Estado Nuevo
                                                        </th>
                                                        <th className="px-3 py-2 text-left border-b border-gray-200">
                                                            Fecha
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {detalles.historia_estados.map(
                                                        (h, i) => (
                                                            <tr
                                                                key={i}
                                                            >
                                                                <td className="px-3 py-2 border-b border-gray-200">
                                                                    {
                                                                        h.estado_anterior
                                                                    }
                                                                </td>
                                                                <td className="px-3 py-2 border-b border-gray-200">
                                                                    {
                                                                        h.estado_nuevo
                                                                    }
                                                                </td>
                                                                <td className="px-3 py-2 border-b border-gray-200">
                                                                    {h.created_at
                                                                        ? new Date(
                                                                              h.created_at,
                                                                          ).toLocaleString()
                                                                        : "-"}
                                                                </td>
                                                            </tr>
                                                        ),
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                               
                                <div className="flex justify-end pt-2">
                                    <button
                                        onClick={handleCerrar}
                                        className="rounded bg-gray-600 px-4 py-2 text-sm text-white hover:bg-gray-700"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </Modal>
            )}

            
            {modalEstadoAbierto && selectedRow && (
                <CambiarEstadoModal
                    isOpen={modalEstadoAbierto}
                    onClose={() => setModalEstadoAbierto(false)}
                    onConfirm={async (data) => {
                        const resultado = await onCambiarEstado(
                            selectedRow.id,
                            data,
                        );
                        if (resultado?.success) {
                            setModalEstadoAbierto(false);
                        }
                        return resultado;
                    }}
                    cotizacion={selectedRow}
                />
            )}
        </>
    );
}
