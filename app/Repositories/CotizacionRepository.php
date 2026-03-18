<?php
namespace App\Repositories;
use App\Models\Cliente;
use App\Models\Cotizacion;
use App\Models\HistorialEstadoCotizacion;

class CotizacionRepository
{

    public function listar(array $filters = [])
    {
        $perPage = (int) ($filters['per_page'] ?? 10);

        return Cotizacion::query()
            ->with(['cliente'])
            ->when(
                !empty($filters['estado']),
                fn($q) =>
                $q->where('estado', $filters['estado'])
            )
            ->when(
                !empty($filters['cliente']),
                fn($q) =>
                $q->whereHas(
                    'cliente',
                    fn($subQuery) =>
                    $subQuery->where('nombre', 'like', '%' . $filters['cliente'] . '%')
                        ->orWhere('correo', 'like', '%' . $filters['cliente'] . '%')
                        ->orWhere('cedula', 'like', '%' . $filters['cliente'] . '%')
                )
            )
            ->when(
                !empty($filters['desde']),
                fn($q) =>
                $q->whereDate('fecha_ingreso', '>=', $filters['desde'])
            )
            ->when(
                !empty($filters['hasta']),
                fn($q) =>
                $q->whereDate('fecha_ingreso', '<=', $filters['hasta'])
            )
            ->orderByDesc('fecha_ingreso')
            ->paginate($perPage)
            ->appends($filters);
    }

    public function buscarPorId(int $id): Cotizacion
    {
        return Cotizacion::with([
            'cliente',
            'documentos',
            'historiaEstados',
        ])->findOrFail($id);
    }
    public function crear(array $data)
    {

        $cliente = Cliente::updateOrCreate(
            ['cedula' => $data['cedula']],
            [
                'nombre' => $data['nombre'],
                'correo' => $data['correo'],
            ]
        );

        $cotizacion = Cotizacion::create([
            'cliente_id' => $cliente->id,
            'marca' => $data['marca'],
            'modelo' => $data['modelo'],
            'anio' => $data['anio'],
            'prima' => $data['prima'] ?? null,
            'fecha_ingreso' => now(),
        ]);

        if (!empty($data['archivos']) && is_array($data['archivos'])) {
            foreach ($data['archivos'] as $archivo) {
                $nombreOriginal = $archivo->getClientOriginalName();
                $extension = $archivo->getClientOriginalExtension();
                $nombreUnico = uniqid() . '.' . $extension;

                $ruta = $archivo->storeAs('doc_cotizaciones', $nombreUnico, 'public');

                $cotizacion->documentos()->create([
                    'nombre' => $nombreOriginal,
                    'ruta' => $ruta,
                    'tipo' => $archivo->getClientMimeType(),
                ]);
            }
        }

        return $cotizacion;
    }

    public function actualizar(array $data, int $id)
    {
        $cotizacion = Cotizacion::findOrFail($id);

        $cliente = Cliente::updateOrCreate(
            ['cedula' => $data['cedula']],
            [
                'nombre' => $data['nombre'],
                'correo' => $data['correo'],
            ]
        );

        $cotizacion->update([
            'cliente_id' => $cliente->id,
            'marca' => $data['marca'],
            'modelo' => $data['modelo'],
            'anio' => $data['anio'],
            'prima' => $data['prima'] ?? $cotizacion->prima,
        ]);

        if (!empty($data['archivos']) && is_array($data['archivos'])) {
            foreach ($data['archivos'] as $archivo) {
                $nombreOriginal = $archivo->getClientOriginalName();
                $extension = $archivo->getClientOriginalExtension();
                $nombreUnico = uniqid() . '.' . $extension;

                $ruta = $archivo->storeAs('doc_cotizaciones', $nombreUnico, 'public');

                $cotizacion->documentos()->create([
                    'nombre' => $nombreOriginal,
                    'ruta' => $ruta,
                    'tipo' => $archivo->getClientMimeType(),
                ]);
            }
        }

        return $cotizacion;
    }

    public function actualizarEstado(int $id, string $estadoAnterior, string $estado)
    {
        $cotizacion = Cotizacion::with('cliente')->findOrFail($id);

        $cotizacion->estado = $estado;
        $cotizacion->save();

        HistorialEstadoCotizacion::create([
            'cotizacion_id' => $id,
            'estado_anterior' => $estadoAnterior,
            'estado_nuevo' => $estado,
        ]);

        return $cotizacion->load([
            'cliente',
            'historiaEstados',
        ]);
    }

}