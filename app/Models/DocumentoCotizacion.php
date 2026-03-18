<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentoCotizacion extends Model
{
    protected $table = 'documentos_cotizacion';
    protected $fillable = [
        'cotizacion_id',
        'nombre',
        'ruta',
        'tipo',
    ];

    public function cotizacion()
    {
        return $this->belongsTo(Cotizacion::class, 'cotizacion_id');
    }
}
