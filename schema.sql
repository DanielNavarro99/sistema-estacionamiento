
DROP DATABASE IF EXISTS estacionamiento_db;

CREATE DATABASE estacionamiento_db;
USE estacionamiento_db;

-- 3. Tabla de USUARIOS (Para el Login y Roles)
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'usuario') DEFAULT 'usuario',
    -- Agregamos las columnas aquí directamente para evitar errores:
    tipo_vehiculo VARCHAR(50) DEFAULT NULL,
    marca_vehiculo VARCHAR(50) DEFAULT NULL,
    placa VARCHAR(20) DEFAULT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tarifas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_vehiculo VARCHAR(50) NOT NULL, -- Ejemplo: 'Automovil', 'Motocicleta'
    costo_por_hora DECIMAL(10, 2) NOT NULL
);

-- 5. Tabla de REGISTROS ( Entradas y Salidas)
CREATE TABLE registros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    placa VARCHAR(20) NOT NULL,
    tipo_vehiculo VARCHAR(50) NOT NULL,
    hora_entrada DATETIME DEFAULT CURRENT_TIMESTAMP,
    hora_salida DATETIME NULL,
    horas_totales DECIMAL(10, 2) DEFAULT 0,
    costo_total DECIMAL(10, 2) DEFAULT 0,
    estado ENUM('activo', 'finalizado') DEFAULT 'activo',
    usuario_entrada_id INT, -- Quién registró la entrada
    usuario_salida_id INT,  -- Quién registró la salida
    FOREIGN KEY (usuario_entrada_id) REFERENCES usuarios(id)
);

-- 6. DATOS DE PRUEBA (¡OBLIGATORIOS PARA PODER ENTRAR!)

-- Insertamos Usuarios: Un Admin y un Empleado normal
INSERT INTO usuarios (nombre, email, password, rol) VALUES 
('Administrador', 'admin@park.com', 'admin123', 'admin'),
('Jose Maria', 'jose@park.com', '123456', 'usuario');

USE estacionamiento_db;

-- Insertar el usuario de prueba con rol 'usuario'
INSERT INTO usuarios (nombre, email, password, rol)
VALUES ('Usuario Prueba', 'prueb323a2@fefe.com', '123', 'usuario');
-- Insertamos las Tarifas iniciales

INSERT INTO tarifas (tipo_vehiculo, costo_por_hora) VALUES 
('Automovil', 20.00),
('Motocicleta', 10.00),
('Camioneta', 25.00);

-- Insertamos un coche que ya está estacionado (para que veas datos en la tabla)
INSERT INTO registros (placa, tipo_vehiculo, usuario_entrada_id) VALUES 
('ABC-123', 'Automovil', 2);
-- fataban estos datos para el registro hay que agregarlos en la tabla usuarios
ALTER TABLE usuarios 
ADD COLUMN tipo_vehiculo VARCHAR(50),
ADD COLUMN marca_vehiculo VARCHAR(50),
ADD COLUMN placa VARCHAR(20);