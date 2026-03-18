export default function Loading({ msg = "cargando..." }) {
    return (
        <div className="text-center py-8">
            <div className="inline-block h-8 w-8 border-4 border-green-700 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-700">{msg}</p>
        </div>
    );
}
