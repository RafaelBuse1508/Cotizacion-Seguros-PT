import { useEffect, useState } from "react";
import { useCotizaciones } from "../hooks/useCotizaciones";
import { useParams } from "react-router-dom";
import CotizacionForm from "../components/CotizacionForm";
import Loading from "../components/Loading";

export default function EditarCotizacion() {
    const { id } = useParams();
    const { cargarCotizacion, actualizar } = useCotizaciones();
    const [cotizacion, setCotizacion] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCotizacion = async () => {
            if (!id) return;

            try {
                setCargando(true);
                setError(null);

                const resultado = await cargarCotizacion(id);

                if (resultado?.success) {
                    setCotizacion(resultado.data);
                } else {
                    setError(
                        resultado?.mensaje || "Error al cargar la cotización",
                    );
                }
            } catch (err) {
                console.error("Error al cargar la cotización:", err);
                setError(err?.message || "Error al cargar la cotización");
            } finally {
                setCargando(false);
            }
        };

        fetchCotizacion();
    }, [id]);

    const handleActualizarCotizacion = async (formData, cotizacionId) => {
        try {
            const resultado = await actualizar(formData, cotizacionId);
            return resultado;
        } catch (error) {
            console.error("Error al actualizar:", error);
            return {
                success: false,
                mensaje: error?.message || "Error al conectar con el servidor",
            };
        }
    };

    if (cargando) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!cotizacion) {
        return (
            <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-6">
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                    <p>No se encontró la cotización solicitada.</p>
                </div>
            </div>
        );
    }

    return (
        <CotizacionForm
            initialValues={cotizacion}
            actualizarCotizacion={handleActualizarCotizacion}
        />
    );
}
