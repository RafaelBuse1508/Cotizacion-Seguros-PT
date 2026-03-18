<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClienteCotizacionSeeder extends Seeder
{
    public function run(): void
    {
        $clienteIds = [];

        $nombres = ['Juan', 'María', 'Carlos', 'Ana', 'Luis', 'Sofía', 'Diego', 'Valentina', 'José', 'Camila'];
        $apellidos = ['González', 'Rodríguez', 'Pérez', 'Martínez', 'López', 'Ramírez', 'Torres', 'Vargas', 'Molina', 'Sánchez'];

        for ($i = 1; $i <= 20; $i++) {
            $nombre = $nombres[array_rand($nombres)] . ' ' . $apellidos[array_rand($apellidos)];
            $correo = strtolower(str_replace(' ', '.', $nombre)) . "@example.com";
            $cedula = str_pad(rand(1, 9999999999), 10, "0", STR_PAD_LEFT);

            $clienteIds[] = DB::table('clientes')->insertGetId([
                'nombre' => $nombre,
                'correo' => $correo,
                'cedula' => $cedula,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $marcasModelos = [
            'Toyota' => ['Corolla', 'Yaris', 'RAV4', 'Hilux'],
            'Honda' => ['Civic', 'Fit', 'CR-V', 'HR-V'],
            'Ford' => ['Fiesta', 'Focus', 'EcoSport', 'Ranger'],
            'Chevrolet' => ['Spark', 'Aveo', 'Cruze', 'Trailblazer'],
            'Nissan' => ['Sentra', 'Versa', 'Altima', 'Frontier'],
        ];

        $estados = ['pendiente', 'aprobado', 'rechazado'];

        foreach ($clienteIds as $clienteId) {
            $numCotizaciones = 1;
            for ($j = 0; $j < $numCotizaciones; $j++) {
                $marca = array_rand($marcasModelos);
                $modelo = $marcasModelos[$marca][array_rand($marcasModelos[$marca])];

                $prima = match ($marca) {
                    'Toyota' => rand(15000, 35000),
                    'Honda' => rand(14000, 32000),
                    'Ford' => rand(13000, 30000),
                    'Chevrolet' => rand(12000, 28000),
                    'Nissan' => rand(14000, 33000),
                    default => rand(10000, 25000),
                };

                DB::table('cotizaciones')->insert([
                    'cliente_id' => $clienteId,
                    'marca' => $marca,
                    'modelo' => $modelo,
                    'anio' => rand(2018, 2023),
                    'prima' => $prima,
                    'estado' => $estados[array_rand($estados)],
                    'fecha_ingreso' => now()->subDays(rand(0, 30)),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
