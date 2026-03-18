<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CrearCotizacionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nombre' => 'required|string',
            'correo' => 'required|email',
            'cedula' => 'required',
            'marca' => 'required',
            'modelo' => 'required',
            'anio' => 'required|integer',
            'prima' => 'sometimes',
            'archivos' => 'sometimes|array',
            'archivos.*' => 'file|mimes:jpg,jpeg,png,pdf|max:5120',
        ];
    }
}
