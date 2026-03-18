<?php

namespace App\Services;

use App\Mail\NotificacionEstadoCotizacion;
use App\Repositories\CotizacionRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
class CotizacionService
{

    protected $repository;

    public function __construct()
    {
        $this->repository = new CotizacionRepository();
    }


    public function listar(array $filters): array
    {
        $paginado = $this->repository->listar($filters);

        return [
            'data' => $paginado->items(),
            'meta' => [
                'current_page' => $paginado->currentPage(),
                'last_page' => $paginado->lastPage(),
                'per_page' => $paginado->perPage(),
                'total' => $paginado->total(),
                'from' => $paginado->firstItem(),
                'to' => $paginado->lastItem(),
            ],
            'links' => [
                'first' => $paginado->url(1),
                'last' => $paginado->url($paginado->lastPage()),
                'prev' => $paginado->previousPageUrl(),
                'next' => $paginado->nextPageUrl(),
            ],
        ];
    }



    public function buscarPorId(int $id)
    {
        return $this->repository->buscarPorId($id);
    }


    public function crear(array $data)
    {
        return DB::transaction(function () use ($data) {
            return $this->repository->crear($data);
        });

    }

    public function actualizar(array $data, int $id)
    {
        return DB::transaction(function () use ($data, $id) {
            return $this->repository->actualizar($data, $id);
        });
    }

    public function actualizarEstado(int $id, string $estado)
    {
        $cotizacion = DB::transaction(function () use ($id, $estado) {

            $cotizacion = $this->repository->buscarPorId($id);

            $estadoAnterior = $cotizacion->estado;

            return $this->repository->actualizarEstado($id, $estadoAnterior, $estado);
        });

        $cotizacion->load('cliente');

        if ($cotizacion->cliente && $cotizacion->cliente->correo) {
            Mail::to($cotizacion->cliente->correo)
                ->queue(new NotificacionEstadoCotizacion($cotizacion));
        }

        return $cotizacion;
    }

}