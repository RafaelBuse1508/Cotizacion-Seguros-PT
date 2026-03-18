<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HistorialEstadoCotizacion extends Model
{
    protected $table = 'historial_estados_cotizacion';
    protected $fillable = [
        'cotizacion_id',
        'estado_anterior',
        'estado_nuevo',
    ];

    public function cotizacion()
    {
        return $this->belongsTo(Cotizacion::class, 'cotizacion_id');
    }
}
