<?php

namespace App\Http\Controllers;

use App\Http\Requests\ActualizarCotizacionRequest;
use App\Http\Requests\ActualizarEstadoRequest;
use App\Http\Requests\CrearCotizacionRequest;
use App\Services\PrimaService;
use App\Services\CotizacionService;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;


class CotizacionController extends Controller
{
    protected $cotizacionService;
    protected $primaService;

    public function __construct()
    {
        $this->cotizacionService = new CotizacionService();
        $this->primaService = new PrimaService();
    }


    public function listar(Request $request)
    {
        try {
            $resultado = $this->cotizacionService->listar($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Cotizaciones obtenidas correctamente',
                'data' => $resultado['data'],
                'meta' => $resultado['meta'],
                'links' => $resultado['links'],
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener las cotizaciones',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function cotizar(Request $request)
    {
        try {
            $data = $this->primaService->cotizar(
                $request->nombre,
                $request->marca,
                $request->anio
            );

            return response()->json([
                'success' => true,
                'message' => 'Cotización calculada correctamente',
                'data' => $data,
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cotizar',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function crear(CrearCotizacionRequest $request)
    {
        try {
            $cotizacion = $this->cotizacionService->crear($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Cotización creada correctamente',
                'data' => $cotizacion,
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear la cotización',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function actualizar(ActualizarCotizacionRequest $request, int $id)
    {
        try {
            $cotizacion = $this->cotizacionService->actualizar($request->validated(), $id);

            return response()->json([
                'success' => true,
                'message' => 'Cotización actualizada correctamente',
                'data' => $cotizacion,
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la cotización',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function buscarPorId(int $id)
    {
        try {
            $data = $this->cotizacionService->buscarPorId($id);

            return response()->json([
                'success' => true,
                'message' => 'Cotización obtenida correctamente',
                'data' => $data,
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Cotización no encontrada',
            ], 404);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener la cotización',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function cambiarEstado(ActualizarEstadoRequest $request, int $id)
    {
        try {
            $cotizacion = $this->cotizacionService->actualizarEstado(
                $id,
                $request->estado_nuevo
            );

            return response()->json([
                'success' => true,
                'message' => 'Estado actualizado correctamente',
                'data' => $cotizacion,
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Cotización no encontrada',
            ], 404);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cambiar el estado',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

}