import CotizacionForm from "../components/CotizacionForm";
import { useCotizaciones } from "../hooks/useCotizaciones";

export default function CrearCotizacion() {
    const { crear } = useCotizaciones();

    const handleCrearCotizacion = async (formData) => {
        try {
            const resultado = await crear(formData);
            return resultado;
        } catch (error) {
            console.error("Error al crear cotización:", error);
            return {
                success: false,
                mensaje: error?.message || "Error al conectar con el servidor",
            };
        }
    };

    return <CotizacionForm crearCotizacion={handleCrearCotizacion} />;
}
