# FinanzApp 💰

Gestor de finanzas personales: registro de ingresos y gastos, categorías, presupuestos mensuales con alertas y compras planificadas.

Proyecto de la Tecnicatura Superior en Desarrollo de Software – IFTS N.º 16.

**Grupo 4:** Alejandra Rogers, Malena Ruiz, Daniel Vasquez, Santiago Garcia

## Funcionalidades

- **Registro e inicio de sesión** con contraseña encriptada y token JWT.
- **Movimientos:** carga y borrado de ingresos y gastos por categoría, con exportación a CSV.
- **Inicio:** balance del mes (ingresos, gastos y saldo), últimos movimientos y selector de mes.
- **Presupuestos:** tope mensual por categoría, con alertas al llegar al 80 % y al superar el 100 %.
- **Compras planificadas** (requisito «carro» de la materia): lista de compras con total; al confirmar una compra se registra como gasto.
- **Guía rápida** en el inicio para usuarios nuevos.
- Diseño de página web que se adapta al celular.

## Tecnologías

- **Backend:** Node.js + Express (API REST)
- **Base de datos:** MySQL 8.0
- **Autenticación:** JWT + bcrypt
- **Frontend:** HTML, CSS Grid y JavaScript

## Estructura

```
finanzapp/
├── backend/
│   ├── db/            → conexion.js y schema.sql
│   ├── middleware/    → verificarToken.js
│   ├── rutas/         → auth.js, movimientos.js, presupuestos.js, compras.js
│   ├── index.js       → servidor Express (sirve también el frontend)
│   ├── pruebas.http   → pruebas de la API con REST Client
│   └── .env.example   → modelo de variables de entorno
└── frontend/
    └── index.html     → pantallas, estilos y lógica del navegador
```

## Cómo instalarlo

Requisitos: Node.js, Git y MySQL 8.0 instalados.

1. Clonar el repositorio:
   ```
   git clone https://github.com/alejandra-rogers/finanzapp.git
   cd finanzapp\backend
   ```
2. Instalar dependencias:
   ```
   npm install
   ```
3. Crear la base de datos: abrir `backend/db/schema.sql` en MySQL Workbench y ejecutarlo.
4. Copiar `.env.example`, renombrar la copia a `.env` y completar con los datos de tu MySQL.
5. Levantar el servidor:
   ```
   node index.js
   ```
6. Abrir **http://localhost:3000** en el navegador, crear una cuenta y empezar a usar la aplicación.

Para probar la API se puede usar la extensión **REST Client** de VS Code con el archivo `backend/pruebas.http`.

> La aplicación necesita el servidor funcionando, por eso se usa desde `localhost:3000` y no desde GitHub Pages.

## Endpoints disponibles

Todas las rutas, salvo registro y login, requieren el encabezado `Authorization: Bearer <token>`.

| Método | Ruta | Descripción |
|---|---|---|
| POST | /api/auth/registro | Registrar usuario |
| POST | /api/auth/login | Iniciar sesión (devuelve token y nombre) |
| GET | /api/movimientos | Listar movimientos (opcional `?mes=2026-11`) |
| POST | /api/movimientos | Crear ingreso o gasto |
| PUT | /api/movimientos/:id | Modificar un movimiento |
| DELETE | /api/movimientos/:id | Eliminar un movimiento |
| GET | /api/presupuestos | Listar presupuestos |
| POST | /api/presupuestos | Crear o actualizar el tope de una categoría |
| DELETE | /api/presupuestos/:id | Eliminar un presupuesto |
| GET | /api/compras | Listar compras planificadas |
| POST | /api/compras | Agregar una compra al carro |
| POST | /api/compras/:id/confirmar | Confirmar la compra (pasa a gastos) |
| DELETE | /api/compras/:id | Quitar una compra del carro |

## Avance

- [x] Entorno y base de datos
- [x] Servidor Express y conexión a MySQL
- [x] Registro y login con JWT
- [x] Movimientos (ingresos y gastos)
- [x] Presupuestos y alertas
- [x] Compras planificadas (requisito «carro» de la materia)
- [x] Integración frontend–backend
- [x] Formato de página web y guía rápida
- [x] Documentación del proyecto
