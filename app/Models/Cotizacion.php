<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cotizacion extends Model
{
    protected $table = 'cotizaciones';
    protected $fillable = [
        'cliente_id',
        'marca',
        'modelo',
        'anio',
        'prima',
        'estado',
        'fecha_ingreso'
    ];

    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }

    public function documentos()
    {
        return $this->hasMany(DocumentoCotizacion::class, 'cotizacion_id');
    }

    public function historiaEstados()
    {
        return $this->hasMany(HistorialEstadoCotizacion::class, 'cotizacion_id');
    }
}
