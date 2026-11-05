-- =============================================
-- FinanzApp - Script de creación de la base
-- =============================================

-- Crea la base (si ya existe, no hace nada)
CREATE DATABASE IF NOT EXISTS finanzapp
  CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci;

USE finanzapp;

-- Usuarios de la aplicación
CREATE TABLE usuarios (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nombre        VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  creado_en     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ingresos y gastos
CREATE TABLE movimientos (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id  INT NOT NULL,
  tipo        ENUM('ingreso', 'gasto') NOT NULL,
  descripcion VARCHAR(150) NOT NULL,
  categoria   VARCHAR(50) NOT NULL,
  monto       DECIMAL(12,2) NOT NULL,
  fecha       DATE NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Límite mensual por categoría (uno por categoría y usuario)
CREATE TABLE presupuestos (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  categoria  VARCHAR(50) NOT NULL,
  limite     DECIMAL(12,2) NOT NULL,
  UNIQUE (usuario_id, categoria),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Compras planificadas (cumple el requisito del «carro»)
CREATE TABLE compras_planificadas (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  producto   VARCHAR(150) NOT NULL,
  categoria  VARCHAR(50) NOT NULL,
  precio     DECIMAL(12,2) NOT NULL,
  creado_en  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);