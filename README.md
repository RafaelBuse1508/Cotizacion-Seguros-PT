* Stack de desarollo
Composer 2.8.12
Laravel 11
php 8.3
node v24.14.0



1. Instalar dependencias de Laravel
composer install

2. Copiar .env y generar clave
cp .env.example .env
php artisan key:generate

3. Crear enlace de storage
php artisan storage:link

4. Configurar base de datos en .env
# (Editar manualmente DB_DATABASE, DB_USERNAME, DB_PASSWORD si es necesario)

5. Configurar variables de React en .env (Vite)
VITE_API_URL=http://127.0.0.1:8000
API_QUOTE_URL=https://68fe50c97c700772bb13737d.mockapi.io/api/test/quotes

6. Ejecutar migraciones
php artisan migrate

7. Configurar correo en .env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=tu_usuario
MAIL_PASSWORD=tu_password
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=pruebas@tudominio.com
MAIL_FROM_NAME="Proyecto Laravel"

8. Instalar dependencias de React (frontend)
npm install

9. Levantar React en modo desarrollo
npm run dev

10. O generar build de producción
npm run build

11. Activar la cola de Laravel
php artisan queue:work

12. Levantar servidor de Laravel
php artisan serve
