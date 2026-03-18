<?php

namespace App\Services;
use Illuminate\Support\Facades\Http;

class PrimaService
{
    public function cotizar($nombre, $marca, $anio)
    {
        $url = env('API_QUOTE_URL'); // lee la URL desde .env

        $response = Http::post($url, [
            'nombre' => $nombre,
            'marca' => $marca,
            'anio' => $anio,
        ]);

        return $response->json();
    }
}