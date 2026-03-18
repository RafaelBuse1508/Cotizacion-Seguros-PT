<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Notificación Estado Cotización</title>
</head>

<body>

    <h2>Notificación de cambio de estado</h2>

    <p>Hola {{ $cotizacion->cliente->nombre ?? 'Cliente' }},</p>

    <p>El estado de tu cotización ha sido actualizado.</p>

    <h3>Información del cliente</h3>

    <ul>
        <li><strong>Nombre:</strong> {{ $cotizacion->cliente->nombre ?? 'N/A' }}</li>
        <li><strong>Cédula:</strong> {{ $cotizacion->cliente->cedula ?? 'N/A' }}</li>
        <li><strong>Correo:</strong> {{ $cotizacion->cliente->correo ?? 'N/A' }}</li>
    </ul>

    <h3>Información de la cotización</h3>

    <ul>
        <li><strong>Marca:</strong> {{ $cotizacion->marca }}</li>
        <li><strong>Modelo:</strong> {{ $cotizacion->modelo }}</li>
        <li><strong>Año:</strong> {{ $cotizacion->anio }}</li>
        <li><strong>Prima:</strong> {{ $cotizacion->prima }}</li>
        <li><strong>Estado actual:</strong> {{ $cotizacion->estado }}</li>
        <li><strong>Fecha de ingreso:</strong> {{ $cotizacion->fecha_ingreso }}</li>
    </ul>



</body>

</html>