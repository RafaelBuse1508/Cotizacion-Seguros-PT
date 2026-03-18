<?php

use App\Http\Controllers\CotizacionController;
use Illuminate\Support\Facades\Route;

Route::prefix('cotizaciones')->group(function () {
    Route::get('/', [CotizacionController::class, 'listar']);
    Route::get('/{id}', [CotizacionController::class, 'buscarPorId']);
    Route::post('/', [CotizacionController::class, 'crear']);
    Route::post('/{id}', [CotizacionController::class, 'actualizar']);
    Route::post('/cotizar', [CotizacionController::class, 'cotizar']);
    Route::patch('/{id}/estado', [CotizacionController::class, 'cambiarEstado']);
});
