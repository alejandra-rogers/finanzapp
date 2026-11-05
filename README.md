# FinanzApp 💰

Gestor de finanzas personales: registro de ingresos y gastos, categorías, presupuestos mensuales con alertas y compras planificadas.

Proyecto de la Tecnicatura Superior en Desarrollo de Software – IFTS N.º 16.

**Grupo 4:** Alejandra Rogers, Malena Ruiz, Daniel Vasquez, Santiago Garcia

## Tecnologías

- **Backend:** Node.js + Express (API REST)
- **Base de datos:** MySQL 8.0
- **Autenticación:** JWT + bcrypt
- **Frontend:** HTML, CSS Grid y JavaScript

## Estructura

```
finanzapp/
├── backend/
│   ├── db/            → conexión y schema.sql
│   ├── middleware/    → verificarToken.js
│   ├── rutas/         → auth.js
│   ├── index.js       → servidor Express
│   └── .env.example   → modelo de variables de entorno
└── frontend/
    ├── css/
    ├── js/
    └── index.html
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
   Queda funcionando en http://localhost:3000

Para probar la API se puede usar la extensión **REST Client** de VS Code con el archivo `backend/pruebas.http`.

## Endpoints disponibles

| Método | Ruta | Descripción |
|---|---|---|
| POST | /api/auth/registro | Registrar usuario |
| POST | /api/auth/login | Iniciar sesión (devuelve token) |

## Avance

- [x] Entorno y base de datos
- [x] Servidor Express y conexión a MySQL
- [x] Registro y login con JWT
- [ ] Movimientos (ingresos y gastos)
- [ ] Presupuestos y alertas
- [ ] Compras planificadas (requisito «carro» de la materia)
- [ ] Integración frontend–backend