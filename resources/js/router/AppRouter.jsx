import { Routes, Route, Navigate } from "react-router-dom";
import ListaCotizaciones from "../pages/ListaCotizaciones";
import CrearCotizacion from "../pages/CrearCotizacion";
import EditarCotizacion from "../pages/EditarCotizacion";

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/cotizaciones" />} />
            <Route path="/cotizaciones" element={<ListaCotizaciones />} />
            <Route path="/cotizaciones/crear" element={<CrearCotizacion />} />
            <Route path="/cotizaciones/:id/editar" element={ <EditarCotizacion/> } />
        </Routes>
    );
}
