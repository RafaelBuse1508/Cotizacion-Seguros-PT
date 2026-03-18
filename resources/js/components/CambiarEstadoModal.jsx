import { useState } from "react";
import Modal from "./Modal";

export default function CambiarEstadoModal({
    isOpen,
    onClose,
    onConfirm,
    cotizacion,
}) {
    const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    const estados = [
        "pendiente",
        "en revision",
        "aprobado",
        "rechazado",
        "cerrado",
    ];
    const estadosDisponibles = estados.filter((e) => e !== cotizacion?.estado);

    const getEstadoStyles = (estado) => {
        switch (estado) {
            case "aprobado":
                return "bg-green-100 text-green-800 border border-green-300";
            case "pendiente":
                return "bg-yellow-100 text-yellow-800 border border-yellow-300";
            case "rechazado":
                return "bg-red-100 text-red-800 border border-red-300";
            case "en revision":
                return "bg-blue-100 text-blue-800 border border-blue-300";
            case "cerrado":
                return "bg-gray-100 text-gray-800 border border-gray-300";
            default:
                return "bg-white border border-gray-300";
        }
    };

    const handleConfirm = async () => {
        if (!estadoSeleccionado) return;

        setCargando(true);
        setError("");

        try {
            const resultado = await onConfirm({ estado: estadoSeleccionado });

            if (resultado?.success) {
                onClose();
            } else {
                setError(resultado?.mensaje || "Error al cambiar el estado");
            }
        } catch (err) {
            setError(err?.message || "Error al cambiar el estado");
        } finally {
            setCargando(false);
        }
    };

    const handleClose = () => {
        if (!cargando) {
            setEstadoSeleccionado(null);
            setError("");
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Cambiar Estado">
            <div className="space-y-4 text-gray-700 text-sm">
                <p className="text-center">
                    Estado actual:{" "}
                    <span
                        className={`px-2 py-1 rounded text-sm font-medium inline-block ${getEstadoStyles(cotizacion?.estado)}`}
                    >
                        {cotizacion?.estado || "pendiente"}
                    </span>
                </p>

                {error && (
                    <div className="p-2 bg-red-100 border border-red-300 text-red-700 rounded text-center">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                    {estadosDisponibles.map((estado) => (
                        <button
                            key={estado}
                            onClick={() => setEstadoSeleccionado(estado)}
                            disabled={cargando}
                            className={`
                                p-2 rounded border text-sm capitalize
                                ${getEstadoStyles(estado)}
                                ${estadoSeleccionado === estado ? "ring-2 ring-blue-400" : ""}
                                ${cargando ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"}
                            `}
                        >
                            {estado}
                        </button>
                    ))}
                </div>

                <div className="flex gap-2 pt-4">
                    <button
                        onClick={handleClose}
                        disabled={cargando}
                        className="flex-1 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={handleConfirm}
                        disabled={!estadoSeleccionado || cargando}
                        className={`
                            flex-1 px-4 py-2 rounded text-sm flex items-center justify-center gap-2
                            ${
                                !estadoSeleccionado || cargando
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-green-500 text-white hover:bg-green-600"
                            }
                        `}
                    >
                        {cargando ? (
                            <>
                                <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                <span>Guardando...</span>
                            </>
                        ) : (
                            "Confirmar"
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
