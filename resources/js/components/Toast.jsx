import { useEffect } from "react";

export default function Toast({ mensaje, color = "green", onClose }) {
    useEffect(() => {
        if (mensaje) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [mensaje, onClose]);

    if (!mensaje) return null;

    const colores = {
        green: "bg-green-200 border-green-400 text-green-900",
        red: "bg-red-200 border-red-400 text-red-900",
        blue: "bg-blue-200 border-blue-400 text-blue-900",
        yellow: "bg-yellow-200 border-yellow-400 text-yellow-900",
        gray: "bg-gray-200 border-gray-400 text-gray-900",
    };

    const animationStyles = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;

    return (
        <>
            <style>{animationStyles}</style>
            <div
                style={{
                    position: "fixed",
                    top: "16px",
                    right: "16px",
                    zIndex: 9999,
                    animation: "fadeIn 0.3s ease-out",
                }}
            >
                <div
                    className={`px-4 py-3 border rounded shadow-lg ${colores[color] || colores.green}`}
                >
                    {mensaje}
                </div>
            </div>
        </>
    );
}
