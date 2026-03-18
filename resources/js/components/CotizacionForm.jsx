import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cotizarPrima } from "../services/primaService";
import Toast from "./Toast";


export default function CotizacionForm({
    initialValues = {},
    crearCotizacion,
    actualizarCotizacion,
}) {

    const navigate = useNavigate();
    
    const [form, setForm] = useState({
        nombre: "",
        cedula: "",
        correo: "",
        marca: "",
        modelo: "",
        anio: "",
        prima: "",
        archivos: [],
        documentos: [],
    });

    const [cargando, setCargando] = useState(false);
    const [toast, setToast] = useState({ mensaje: "", color: "green" });

    useEffect(() => {
        if (initialValues && Object.keys(initialValues).length > 0) {
            const cliente = initialValues.cliente || {};

            const documentosExistentes = initialValues.documentos || [];

            setForm({
                nombre: cliente.nombre || "",
                cedula: cliente.cedula || "",
                correo: cliente.correo || "",
                marca: initialValues.marca || "",
                modelo: initialValues.modelo || "",
                anio: initialValues.anio || "",
                prima: initialValues.prima || "",
                documentos: documentosExistentes,
                archivos: [],
            });
        }
    }, [initialValues]);

    const mostrarToast = (texto, color = "green") => {
        setToast({ mensaje: texto, color });
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRemoveArchivo = (index, tipo) => {
        if (tipo === "nuevo") {
            const nuevosArchivos = [...form.archivos];
            nuevosArchivos.splice(index, 1);
            setForm({ ...form, archivos: nuevosArchivos });
        }
    };

    const handleFilesChange = (e) => {
        const files = Array.from(e.target.files);

        const permitidos = files.filter(
            (f) => f.type.includes("image") || f.type.includes("pdf"),
        );

        if (permitidos.length !== files.length) {
            mostrarToast("Solo se permiten imágenes o PDF", "red");
            return;
        }

        const maxSize = 5 * 1024 * 1024;
        const archivosValidos = permitidos.filter((f) => f.size <= maxSize);

        if (archivosValidos.length !== permitidos.length) {
            mostrarToast(
                "Algunos archivos exceden el tamaño máximo de 5MB",
                "red",
            );
            return;
        }

        const totalArchivos =
            form.documentos.length +
            form.archivos.length +
            archivosValidos.length;
        if (totalArchivos > 5) {
            mostrarToast("No puedes tener más de 5 archivos en total", "red");
            return;
        }

        setForm((prev) => ({
            ...prev,
            archivos: [...prev.archivos, ...archivosValidos],
        }));

        e.target.value = "";
    };

    const handleCotizar = async () => {
        if (
            !form.nombre ||
            !form.cedula ||
            !form.correo ||
            !form.marca ||
            !form.modelo ||
            !form.anio
        ) {
            mostrarToast(
                "Todos los campos del cliente y vehículo son obligatorios para cotizar",
                "red",
            );
            return;
        }

        setCargando(true);
        try {
            const data = {
                nombre: form.nombre,
                marca: form.marca,
                anio: form.anio,
            };

            const resultado = await cotizarPrima(data);

            if (resultado?.price) {
                setForm((prev) => ({ ...prev, prima: resultado.price }));
                mostrarToast("Prima calculada correctamente", "green");
            } else {
                mostrarToast(
                    resultado?.mensaje || "No se pudo calcular la prima",
                    "red",
                );
            }
        } catch (err) {
            console.error(err);
            mostrarToast("Error al obtener la prima", "red");
        } finally {
            setCargando(false);
        }
    };

    const handleGuardar = async () => {
        if (
            !form.nombre ||
            !form.cedula ||
            !form.correo ||
            !form.marca ||
            !form.modelo ||
            !form.anio ||
            !form.prima
        ) {
            mostrarToast(
                "Debes completar todos los campos y cotizar antes de guardar",
                "red",
            );
            return;
        }

        setCargando(true);
        try {
            const formData = new FormData();

            formData.append("nombre", form.nombre);
            formData.append("cedula", form.cedula);
            formData.append("correo", form.correo);
            formData.append("marca", form.marca);
            formData.append("modelo", form.modelo);
            formData.append("anio", form.anio);
            formData.append("prima", form.prima);

            if (form.documentos.length > 0) {
                form.documentos.forEach((doc, index) => {
                    if (doc.id) {
                        formData.append(`documentos[${index}][id]`, doc.id);
                    } else if (typeof doc === "string") {
                        formData.append(`documentos[${index}][url]`, doc);
                    }
                });
            }

            if (form.archivos.length > 0) {
                form.archivos.forEach((file) => {
                    formData.append("archivos[]", file);
                });
            }

            console.log("Enviando formulario:", {
                campos: {
                    nombre: form.nombre,
                    cedula: form.cedula,
                    correo: form.correo,
                    marca: form.marca,
                    modelo: form.modelo,
                    anio: form.anio,
                    prima: form.prima,
                },
                documentosExistentes: form.documentos.length,
                archivosNuevos: form.archivos.length,
            });

            let resultado;
            if (initialValues.id && actualizarCotizacion) {
                resultado = await actualizarCotizacion(
                    formData,
                    initialValues.id,
                );
                if (resultado?.success) {
                    mostrarToast(
                        "Cotización actualizada correctamente",
                        "green",
                    );

                    setTimeout(() => {
                        navigate("/cotizaciones");
                    }, 1500);
                } else {
                    mostrarToast(
                        resultado?.mensaje || "Error al actualizar",
                        "red",
                    );
                }
            } else if (crearCotizacion) {
                resultado = await crearCotizacion(formData);
                if (resultado?.success) {
                    mostrarToast("Cotización creada correctamente", "green");

                    setForm({
                        nombre: "",
                        cedula: "",
                        correo: "",
                        marca: "",
                        modelo: "",
                        anio: "",
                        prima: "",
                        archivos: [],
                        documentos: [],
                    });
                } else {
                    mostrarToast(
                        resultado?.mensaje || "Error al crear cotización",
                        "red",
                    );
                }
            }
        } catch (err) {
            console.error("Error en handleGuardar:", err);
            mostrarToast(
                err?.message || "Error al guardar la cotización",
                "red",
            );
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-6 relative">
            <Toast
                mensaje={toast.mensaje}
                color={toast.color}
                onClose={() => setToast({ mensaje: "", color: "green" })}
            />

            <h1 className="text-2xl font-bold mb-4">
                {initialValues?.id ? "Editar Cotización" : "Crear Cotización"}
            </h1>

            <div className="space-y-6">
                <div className="border-b pb-4">
                    <h2 className="text-lg font-semibold mb-4">
                        Datos del Cliente
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre
                            </label>
                            <input
                                name="nombre"
                                placeholder="Nombre"
                                value={form.nombre}
                                onChange={handleChange}
                                className="border px-3 py-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cédula
                            </label>
                            <input
                                name="cedula"
                                placeholder="Cédula"
                                value={form.cedula}
                                onChange={handleChange}
                                readOnly={!!initialValues?.id}
                                className={`border px-3 py-2 rounded w-full ${
                                    initialValues?.id
                                        ? "bg-gray-100 cursor-not-allowed"
                                        : "focus:ring-2 focus:ring-blue-500"
                                }`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Correo
                            </label>
                            <input
                                name="correo"
                                type="email"
                                placeholder="Correo electrónico"
                                value={form.correo}
                                onChange={handleChange}
                                className="border px-3 py-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="border-b pb-4">
                    <h2 className="text-lg font-semibold mb-4">
                        Datos del Vehículo
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Marca
                            </label>
                            <input
                                name="marca"
                                placeholder="Marca del vehículo"
                                value={form.marca}
                                onChange={handleChange}
                                className="border px-3 py-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Modelo
                            </label>
                            <input
                                name="modelo"
                                placeholder="Modelo del vehículo"
                                value={form.modelo}
                                onChange={handleChange}
                                className="border px-3 py-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Año
                            </label>
                            <input
                                name="anio"
                                type="number"
                                placeholder="Año del vehículo"
                                value={form.anio}
                                onChange={handleChange}
                                className="border px-3 py-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Prima
                            </label>
                            <input
                                name="prima"
                                placeholder="Prima calculada"
                                value={form.prima}
                                readOnly
                                className="border px-3 py-2 rounded w-full bg-gray-100 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Documentos adjuntos
                        </label>

                        {form.documentos.length > 0 && (
                            <div className="mb-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {form.documentos.map((doc, index) => (
                                        <a
                                            key={index}
                                            href={`${import.meta.env.VITE_API_URL}/storage/${doc.ruta}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors group"
                                            title={`Abrir ${doc.nombre || `Documento ${index + 1}`}`}
                                        >
                                            {/* Icono PDF/Imagen */}
                                            <svg
                                                className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                                />
                                            </svg>

                                            <span className="text-sm text-blue-700 group-hover:text-blue-900 truncate flex-1">
                                                {doc.nombre ||
                                                    `Documento ${index + 1}`}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        <input
                            type="file"
                            multiple
                            accept=".pdf,image/*"
                            onChange={handleFilesChange}
                            className="border px-3 py-2 rounded w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Máximo 5 archivos en total. Tamaño máximo: 5MB por
                            archivo. Formatos permitidos: PDF, JPG, PNG
                        </p>

                        {form.archivos.length > 0 && (
                            <div className="mt-4">
                                <h4 className="text-sm font-medium text-gray-600 mb-2">
                                    Archivos nuevos para subir:
                                </h4>
                                <ul className="space-y-2">
                                    {form.archivos.map((file, i) => (
                                        <li
                                            key={i}
                                            className="flex justify-between items-center bg-green-50 px-3 py-2 rounded border border-green-200"
                                        >
                                            <span className="text-sm truncate flex items-center">
                                                <svg
                                                    className="w-4 h-4 mr-2 text-green-500"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                    />
                                                </svg>
                                                {file.name} (
                                                {(file.size / 1024).toFixed(2)}{" "}
                                                KB)
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveArchivo(
                                                        i,
                                                        "nuevo",
                                                    )
                                                }
                                                className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                                            >
                                                Quitar
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="mt-2 text-sm text-gray-600">
                            Total archivos:{" "}
                            {form.documentos.length + form.archivos.length} / 5
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 mt-6">
                <button
                    onClick={handleCotizar}
                    disabled={cargando}
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Cotizar
                </button>
                <button
                    onClick={handleGuardar}
                    disabled={cargando || !form.prima}
                    className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    {cargando ? "Guardando..." : "Guardar"}
                </button>
            </div>
        </div>
    );
}
