# Estructura de Datos

En este documento veremos la estructura principal de los datos de la aplicación con un ejemplo JSON, la sintaxis SQL y el modelo de Mongoose para MongoDB.

## Índice

- [Base de Datos](#base-de-datos)
- [Tablas](#tablas)
    - [Usuario](#usuario)
    - [Dirección](#dirección)
    - [Configuración](#configuración)
    - [Vendedor](#vendedor)
    - [Producto](#producto)
    - [Reseña](#reseña)

## Base de Datos

Aunque recurriremos a SQL para explicar la sintaxis, la base de datos **real** será MongoDB, por lo que los datos se guardarán en documentos JSON.

### ¿Por qué MongoDB en vez de SQL?

Si bien los datos están estructurados, no necesariamente se cumplirán todos los campos todas las veces o quizá creemos nuevos durante el desarrollo, así que es mejor y más sencillo algo no relacional.

Además, la tabla de Configuración es dinámica y no tiene un formato fijo, lo que la hace ideal para MongoDB.

## Tablas

Los datos se presentarán con las siguientes tablas para una explicación más sencilla.

Cada tabla tendrá los siguientes apartados:

- Campos: Nombre del campo en la base de datos.
- Descripción: Explicación del campo.
- Sintaxis SQL: Creación de la tabla en SQL.
- Ejemplo JSON: Ejemplo de un documento JSON con los campos.
- Modelo de Mongoose: Modelo de Mongoose para MongoDB.
- Relaciones: Explicación de las relaciones entre tablas.

---

### Usuario

Es la tabla principal, en ella se guardan los datos del usuario además de los datos de autenticación.

| Campos     | Descripción                                                                                                                                                                                            |
|:-----------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Id         | Es la llave primaria del objeto, este será autogenerado mediante MongoDB.                                                                                                                              |
| Nombre     | No tiene condiciones, se puede repetir, es una forma de llamar al usuario en correos electrónicos o similares.                                                                                         |
| Correo     | A diferencia del nombre este sí es único y no es solo para llamar al usuario, también es uno de los dos campos de autenticación.                                                                       |
| Contraseña | Segundo campo de autenticación. Debe tener entre 8-18 caracteres, no secuencias continuas de números o letras (123, fgh), al menos una mayúscula, una minúscula y un carácter especial ($, &, #, ...). |

**Sintaxis SQL:**
```sql
CREATE TABLE Usuario (
    Id         INT PRIMARY KEY AUTO_INCREMENT,
    Nombre     VARCHAR(50)         NOT NULL,
    Correo     VARCHAR(100) UNIQUE NOT NULL,
    Contraseña VARCHAR(255)        NOT NULL
);
```

**Ejemplo JSON:**
```json
{
  "Id": "609c1f2e8f1b2c0015b3c4d5",
  "Nombre": "Juan Perez",
  "Correo": "JuanPerez@example.com",
  "Contraseña": "<hashed_password>"
}
```

**Modelo de Mongoose:**
```javascript
import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
    Nombre: { type: String, required: true },
    Correo: { type: String, required: true, unique: true },
    Contraseña: { type: String, required: true }
});

export default mongoose.model('Usuario', usuarioSchema);
```

**Relaciones:**
- Un usuario puede tener varias direcciones.
- Un usuario puede tener una configuración.
- Un usuario puede registrarse como vendedor.
- Un usuario puede dejar varias reseñas.

---

### Dirección

Esta tabla es un subdocumento de Usuario, en ella se guardan las direcciones del usuario, puede tener varias direcciones.

| Campo         | Descripción                               |
|:--------------|:------------------------------------------|
| Id            | Llave primaria, autogenerada por MongoDB. |
| Id_Usuario    | Llave foránea, referencia al usuario.     |
| Código Postal | Parte necesaria de la dirección.          |
| Calle         | Parte necesaria de la dirección.          |
| Número        | Parte necesaria de la dirección.          |
| Ciudad        | Parte necesaria de la dirección.          |
| Estado        | Parte necesaria de la dirección.          |
| País          | Parte necesaria de la dirección.          |
| Longitud      | Coordenada geográfica.                    |
| Latitud       | Coordenada geográfica.                    |

**Sintaxis SQL:**
```sql
CREATE TABLE Direccion (
    Id            INT PRIMARY KEY AUTO_INCREMENT,
    Id_Usuario    INT,
    Codigo_Postal VARCHAR(20)  NOT NULL,
    Calle         VARCHAR(100) NOT NULL,
    Numero        VARCHAR(10)  NOT NULL,
    Ciudad        VARCHAR(50)  NOT NULL,
    Estado        VARCHAR(50)  NOT NULL,
    Pais          VARCHAR(50)  NOT NULL,
    Longitud      DECIMAL(9, 6),
    Latitud       DECIMAL(9, 6),
    FOREIGN KEY (Id_Usuario) REFERENCES Usuario (Id)
);
```

**Ejemplo JSON:**
```json
{
  "Id": "609c1f2e8f1b2c0015b3c4d6",
  "Id_Usuario": "609c1f2e8f1b2c0015b3c4d5",
  "Codigo_Postal": "12345",
  "Calle": "Calle Falsa",
  "Numero": "123",
  "Ciudad": "Springfield",
  "Estado": "IL",
  "Pais": "USA",
  "Longitud": -89.6500,
  "Latitud": 39.7833
}
```

**Modelo de Mongoose:**
```javascript
import mongoose from 'mongoose';

const direccionSchema = new mongoose.Schema({
    Id_Usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    Codigo_Postal: { type: String, required: true },
    Calle: { type: String, required: true },
    Numero: { type: String, required: true },
    Ciudad: { type: String, required: true },
    Estado: { type: String, required: true },
    Pais: { type: String, required: true },
    Longitud: { type: Number },
    Latitud: { type: Number }
});

export default mongoose.model('Direccion', direccionSchema);
```

**Relaciones:**
- Una dirección pertenece a un usuario.

---

### Configuración

Configura las preferencias del usuario. Solo se guardan los ajustes modificados.

| Campo      | Descripción                                  |
|:-----------|:---------------------------------------------|
| Id         | Llave primaria, autogenerada por MongoDB.    |
| Id_Usuario | Llave foránea, referencia al usuario.        |
| Ajuste     | Array de ajustes modificados por el usuario. |

Cada ajuste es un objeto con:
- NombreDelAjuste: nombre del ajuste.
- Valor: puede ser **boolean** o un valor de tipo **String** (enum).

**Sintaxis SQL:**
```sql
CREATE TABLE Configuracion (
    Id         INT PRIMARY KEY AUTO_INCREMENT,
    Id_Usuario INT,
    Ajuste     JSON,
    FOREIGN KEY (Id_Usuario) REFERENCES Usuario (Id)
);
```

**Ejemplo JSON:**
```json
{
  "Id": "609c1f2e8f1b2c0015b3c4d7",
  "Id_Usuario": "609c1f2e8f1b2c0015b3c4d5",
  "Ajuste": [
    { "NombreDelAjuste": "notificaciones", "Valor": true },
    { "NombreDelAjuste": "tema", "Valor": "oscuro" },
    { "NombreDelAjuste": "idioma", "Valor": "es" }
  ]
}
```

**Modelo de Mongoose:**
```javascript
import mongoose from 'mongoose';

const ajusteSchema = new mongoose.Schema({
    NombreDelAjuste: { type: String, required: true },
    Valor: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      validate: {
        validator: v => typeof v === 'boolean' || typeof v === 'string',
        message: 'El valor debe ser booleano o string'
      }
    }
});

const configuracionSchema = new mongoose.Schema({
    Id_Usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    Ajuste: [ajusteSchema]
});

export default mongoose.model('Configuracion', configuracionSchema);
```

**Relaciones:**
- Una configuración pertenece a un usuario.

---

### Vendedor

Tabla que guarda los datos públicos del vendedor.

| Campo              | Descripción                                        |
|:-------------------|:---------------------------------------------------|
| Id                 | Llave primaria, autogenerada por MongoDB.          |
| Id_Usuario         | Llave foránea, referencia al usuario propietario.  |
| Nombre_de_Vendedor | Nombre público del vendedor.                       |
| Biografia          | Breve descripción del vendedor.                    |
| Rating             | Calificación promedio del vendedor.                |
| Total_ventas       | Número total de ventas realizadas.                 |
| Estado             | Estado del vendedor: activo, inactivo, suspendido. |

**Sintaxis SQL:**
```sql
CREATE TABLE Vendedor (
    Id                 INT PRIMARY KEY AUTO_INCREMENT,
    Id_Usuario         INT,
    Nombre_de_Vendedor VARCHAR(100) NOT NULL,
    Biografia          TEXT NOT NULL,
    Rating             DECIMAL(2, 1) DEFAULT 0,
    Total_ventas       INT DEFAULT 0,
    Estado             ENUM('activo', 'inactivo', 'suspendido') DEFAULT 'activo',
    FOREIGN KEY (Id_Usuario) REFERENCES Usuario (Id)
);
```

**Ejemplo JSON:**
```json
{
  "Id": "609c1f2e8f1b2c0015b3c4d8",
  "Id_Usuario": "609c1f2e8f1b2c0015b3c4d5",
  "Nombre_de_Vendedor": "Tienda de Juan",
  "Biografia": "Especializados en productos artesanales.",
  "Rating": 4.8,
  "Total_ventas": 150,
  "Estado": "activo"
}
```

**Modelo de Mongoose:**
```javascript
import mongoose from 'mongoose';

const vendedorSchema = new mongoose.Schema({
    Id_Usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    Nombre_de_Vendedor: { type: String, required: true },
    Biografia: { type: String, required: true },
    Rating: { type: Number, default: 0 },
    Total_ventas: { type: Number, default: 0 },
    Estado: { type: String, enum: ['activo', 'inactivo', 'suspendido'], default: 'activo' }
});

export default mongoose.model('Vendedor', vendedorSchema);
```

**Relaciones:**
- Un vendedor pertenece a un usuario.
- Un vendedor puede tener varios productos.

---

### Producto

Guarda los productos que los vendedores tienen a la venta.

| Campo       | Descripción                               |
|:------------|:------------------------------------------|
| Id          | Llave primaria, autogenerada por MongoDB. |
| Id_Vendedor | Llave foránea, referencia al vendedor.    |
| Nombre      | Nombre del producto.                      |
| Descripción | Descripción del producto.                 |
| Precio      | Precio del producto.                      |
| Stock       | Unidades disponibles.                     |

**Sintaxis SQL:**
```sql
CREATE TABLE Producto (
    Id          INT PRIMARY KEY AUTO_INCREMENT,
    Id_Vendedor INT,
    Nombre      VARCHAR(100) NOT NULL,
    Descripcion TEXT,
    Precio      DECIMAL(10, 2) NOT NULL,
    Stock       INT DEFAULT 0,
    FOREIGN KEY (Id_Vendedor) REFERENCES Vendedor (Id)
);
```

**Ejemplo JSON:**
```json
{
  "Id": "609c1f2e8f1b2c0015b3c4d9",
  "Id_Vendedor": "609c1f2e8f1b2c0015b3c4d8",
  "Nombre": "Artesanía de madera",
  "Descripcion": "Figura tallada a mano.",
  "Precio": 350.00,
  "Stock": 10
}
```

**Modelo de Mongoose:**
```javascript
import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
    Id_Vendedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendedor', required: true },
    Nombre: { type: String, required: true },
    Descripcion: { type: String },
    Precio: { type: Number, required: true },
    Stock: { type: Number, default: 0 }
});

export default mongoose.model('Producto', productoSchema);
```

**Relaciones:**
- Un producto pertenece a un vendedor.
- Un producto puede tener varias reseñas.

---

### Reseña

Guarda las reseñas que los usuarios han dado a los **productos**.

| Campo        | Descripción                                              |
|:-------------|:---------------------------------------------------------|
| Id           | Llave primaria, autogenerada por MongoDB.                |
| Id_Usuario   | Llave foránea, referencia al usuario que deja la reseña. |
| Id_Producto  | Llave foránea, referencia al producto reseñado.          |
| Comentario   | Texto de la reseña.                                      |
| Calificación | Puntuación numérica (1-5, por ejemplo).                  |

**Sintaxis SQL:**
```sql
CREATE TABLE Reseña (
    Id          INT PRIMARY KEY AUTO_INCREMENT,
    Id_Usuario  INT,
    Id_Producto INT,
    Comentario  TEXT,
    Calificacion INT CHECK (Calificacion BETWEEN 1 AND 5),
    FOREIGN KEY (Id_Usuario) REFERENCES Usuario (Id),
    FOREIGN KEY (Id_Producto) REFERENCES Producto (Id)
);
```

**Ejemplo JSON:**
```json
{
  "Id": "609c1f2e8f1b2c0015b3c4da",
  "Id_Usuario": "609c1f2e8f1b2c0015b3c4d5",
  "Id_Producto": "609c1f2e8f1b2c0015b3c4d9",
  "Comentario": "Excelente calidad y atención.",
  "Calificacion": 5
}
```

**Modelo de Mongoose:**
```javascript
import mongoose from 'mongoose';

const resenaSchema = new mongoose.Schema({
    Id_Usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    Id_Producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
    Comentario: { type: String },
    Calificacion: { type: Number, min: 1, max: 5 }
});

export default mongoose.model('Resena', resenaSchema);
```

**Relaciones:**
- Una reseña pertenece a un usuario.
- Una reseña pertenece a un producto.
- Un producto puede tener muchas reseñas.

---

## Resumen de Relaciones

- **Usuario**: puede tener varias **Direcciones** y **Configuraciones**; puede ser **Vendedor** y dejar **Reseñas**.
- **Dirección**: pertenece a un **Usuario**.
- **Configuración**: pertenece a un **Usuario**.
- **Vendedor**: pertenece a un **Usuario** y puede tener varios **Productos**.
- **Producto**: pertenece a un **Vendedor** y puede tener muchas **Reseñas**.
- **Reseña**: pertenece a un **Usuario** y a un **Producto**.

[Diagrama](EstructuraDeDatos.mmd)

---
