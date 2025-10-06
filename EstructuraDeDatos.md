# Estructura de Datos

En este documento veremos la estructura principal de los datos de la aplicación con un ejemplo JSON, la sintaxis SQL y
el modelo de Mongoose para MongoDB.

## Índice

- [Base de Datos](#base-de-datos)
- [Tablas](#tablas)
  - [Usuario](#usuario)
  - [Direccion](#direccion)
  - [Perfil Usuario](#perfil-usuario)
  - [Categoria](#categoria)
  - [Marca](#marca)
  - [Producto](#producto)
  - [Publicacion](#publicacion)
  - [Variacion Publicacion](#variacion-publicacion)
  - [Imagen](#imagen)
  - [Perfil Envio](#perfil-envio)
  - [Opcion Envio](#opcion-envio)
  - [Transaccion Inventario](#transaccion-inventario)
  - [Carrito](#carrito)
  - [Item Carrito](#item-carrito)
  - [Pedido](#pedido)
  - [Item Pedido](#item-pedido)
  - [Pago](#pago)
  - [Reembolso](#reembolso)
  - [Envio](#envio)
  - [Pregunta Producto](#pregunta-producto)
  - [Respuesta Producto](#respuesta-producto)
  - [Mensaje](#mensaje)
  - [Resena](#resena)
  - [Disputa](#disputa)
  - [Promocion](#promocion)
  - [Metodo Pago](#metodo-pago)
  - [Cartera](#cartera)
  - [Transaccion Cartera](#transaccion-cartera)
  - [Metricas Vendedor](#metricas-vendedor)
  - [Registro Auditoria](#registro-auditoria)

## Base de Datos

Aunque recurriremos a SQL para explicar la sintaxis, la base de datos
real será MongoDB, por lo que los datos se guardarán en
documentos JSON.

### ¿Por qué MongoDB en vez de SQL?

Si bien los datos están estructurados, no necesariamente se cumplirán
todos los campos todas las veces o quizá creemos nuevos durante el
desarrollo, así que es mejor y más sencillo algo no relacional.

Además, algunas colecciones como configuración o metadatos son dinámicas y tienen formato flexible, ideales para MongoDB.

## Tablas

Cada tabla/documento tendrá los siguientes apartados:

- Campos: Nombre del campo en la base de datos.
- Descripción: Explicación del campo (en español).
- Sintaxis SQL: Creación de la tabla en SQL (nombres y sintaxis en inglés).
- Ejemplo JSON: Ejemplo de un documento JSON con los campos (en inglés).
- Modelo de Mongoose: Modelo de Mongoose para MongoDB (en inglés).
- Relaciones: Explicación de las relaciones entre tablas (en español).

---

<a id="usuario"></a>

### Usuario

Es la tabla principal; guarda datos del usuario y autenticación.

| Campos          | Descripción (español)                                         |
| :-------------- | :------------------------------------------------------------ |
| id              | Identificador único del usuario (generado por MongoDB).       |
| username        | Nombre de usuario para login y referencias.                   |
| email           | Correo electrónico único usado también para autenticación.    |
| hashed_password | Contraseña almacenada de forma segura (hash).                 |
| display_name    | Nombre público mostrado en la plataforma.                     |
| user_type       | Tipo de usuario: comprador, vendedor, ambos o admin.          |
| status          | Estado del usuario: activo, suspendido, eliminado, pendiente. |
| created_at      | Fecha de creación del registro.                               |
| updated_at      | Fecha de última actualización.                                |

**SQL syntax (English):**

```sql
CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  hashed_password VARCHAR(255),
  display_name VARCHAR(200),
  user_type ENUM('buyer','seller','both','admin') NOT NULL DEFAULT 'buyer',
  status ENUM('active','suspended','deleted','pending') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**JSON example (English):**

```json
{
  "id": "615f1a2b3c4d5e6f7a8b9c0d",
  "username": "jperez",
  "email": "jperez@example.com",
  "hashed_password": "<hashed_password>",
  "display_name": "Juan Perez",
  "user_type": "buyer",
  "status": "active",
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": "2024-01-10T12:00:00Z"
}
```

**Mongoose model (English):**

```javascript
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    hashed_password: { type: String },
    display_name: { type: String },
    user_type: {
      type: String,
      enum: ["buyer", "seller", "both", "admin"],
      default: "buyer",
    },
    status: {
      type: String,
      enum: ["active", "suspended", "deleted", "pending"],
      default: "active",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model("User", userSchema);
```

**Relaciones:**

- Un usuario puede tener varias direcciones.
- Un usuario puede tener perfil extendido.
- Un usuario puede ser vendedor y tener publicaciones, pedidos, pagos, reseñas.

---

<a id="direccion"></a>

### Dirección

Subdocumento o colección de direcciones asociadas a un usuario.

| Campos       | Descripción (español)               |
| :----------- | :---------------------------------- |
| id           | Identificador de la dirección.      |
| user_id      | Referencia al usuario propietario.  |
| label        | Etiqueta (Casa, Oficina).           |
| contact_name | Nombre de contacto en la dirección. |
| phone        | Teléfono de contacto.               |
| street       | Calle.                              |
| number       | Número.                             |
| complement   | Complemento.                        |
| neighborhood | Barrio.                             |
| city         | Ciudad.                             |
| state        | Provincia / Estado.                 |
| postal_code  | Código postal.                      |
| country      | País.                               |
| geo_lat      | Latitud.                            |
| geo_lon      | Longitud.                           |
| created_at   | Fecha de creación.                  |
| updated_at   | Fecha de actualización.             |

**SQL syntax (English):**

```sql
CREATE TABLE addresses (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  label VARCHAR(50),
  contact_name VARCHAR(200),
  phone VARCHAR(50),
  street VARCHAR(255),
  number VARCHAR(50),
  complement VARCHAR(255),
  neighborhood VARCHAR(200),
  city VARCHAR(200),
  state VARCHAR(200),
  postal_code VARCHAR(50),
  country VARCHAR(100),
  geo_lat DECIMAL(10,7),
  geo_lon DECIMAL(10,7),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**JSON example (English):**

```json
{
  "id": "615f1a2b3c4d5e6f7a8b9c1e",
  "user_id": "615f1a2b3c4d5e6f7a8b9c0d",
  "label": "Home",
  "contact_name": "Juan Perez",
  "phone": "+5491122233344",
  "street": "Calle Falsa",
  "number": "123",
  "complement": "Depto 1",
  "neighborhood": "Centro",
  "city": "Ciudad",
  "state": "Provincia",
  "postal_code": "1000",
  "country": "AR",
  "geo_lat": -34.6037,
  "geo_lon": -58.3816
}
```

**Mongoose model (English):**

```javascript
import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    label: String,
    contact_name: String,
    phone: String,
    street: String,
    number: String,
    complement: String,
    neighborhood: String,
    city: String,
    state: String,
    postal_code: String,
    country: String,
    geo_lat: Number,
    geo_lon: Number,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model("Address", addressSchema);
```

**Relaciones:**

- Una dirección pertenece a un usuario.
- Un usuario puede tener muchas direcciones.

---

<a id="perfil-usuario"></a>

### Perfil Usuario

Perfil extendido y reputación del usuario (principalmente vendedores).

| Campos           | Descripción (español)                |
| :--------------- | :----------------------------------- |
| user_id          | Referencia al usuario (PK y FK).     |
| phone            | Teléfono adicional.                  |
| description      | Descripción pública del vendedor.    |
| reputation_score | Puntuación de reputación (numérica). |
| seller_level     | Nivel del vendedor (texto).          |
| metadata         | Metadatos flexibles (JSON).          |

**SQL syntax (English):**

```sql
CREATE TABLE user_profiles (
  user_id BIGINT UNSIGNED PRIMARY KEY,
  phone VARCHAR(50),
  description TEXT,
  reputation_score DECIMAL(5,2) DEFAULT 0.00,
  seller_level VARCHAR(50),
  metadata JSON,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**JSON example (English):**

```json
{
  "user_id": "615f1a2b3c4d5e6f7a8b9c0d",
  "phone": "+5491122233344",
  "description": "Vendedor con trayectoria",
  "reputation_score": 4.82,
  "seller_level": "gold",
  "metadata": { "since": 2018, "sales": 1250 }
}
```

**Mongoose model (English):**

```javascript
import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  phone: String,
  description: String,
  reputation_score: { type: Number, default: 0.0 },
  seller_level: String,
  metadata: Object,
});

export default mongoose.model("UserProfile", userProfileSchema);
```

**Relaciones:**

- Perfil pertenece a un usuario (1:1).

---

<a id="categoria"></a>

### Categoría

Categorías jerárquicas para productos.

| Campos            | Descripción (español)                          |
| :---------------- | :--------------------------------------------- |
| id                | Identificador de categoría.                    |
| parent_id         | Referencia a categoría padre (nullable).       |
| name              | Nombre de la categoría.                        |
| slug              | Slug amigable.                                 |
| path              | Ruta jerárquica representada como texto.       |
| attributes_schema | Esquema de atributos (JSON) para la categoría. |
| is_active         | Indicador si la categoría está activa.         |

**SQL syntax (English):**

```sql
CREATE TABLE categories (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  parent_id BIGINT UNSIGNED,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255),
  path VARCHAR(2000),
  attributes_schema JSON,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);
```

**JSON example (English):**

```json
{
  "id": "cat_001",
  "parent_id": null,
  "name": "Electronics",
  "slug": "electronics",
  "path": "Electronics",
  "attributes_schema": { "brand": "string", "model": "string" },
  "is_active": true
}
```

**Mongoose model (English):**

```javascript
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    parent_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    name: { type: String, required: true },
    slug: String,
    path: String,
    attributes_schema: Object,
    is_active: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: "created_at" } }
);

export default mongoose.model("Category", categorySchema);
```

**Relaciones:**

- Una categoría puede tener subcategorías (auto-relación).
- Una categoría puede tener muchos productos.

---

<a id="marca"></a>

### Marca

Fabricante o marca del producto.

| Campos   | Descripción (español)         |
| :------- | :---------------------------- |
| id       | Identificador de la marca.    |
| name     | Nombre único de la marca.     |
| metadata | Metadatos adicionales (JSON). |

**SQL syntax (English):**

```sql
CREATE TABLE brands (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**JSON example (English):**

```json
{
  "id": "brand_001",
  "name": "ExampleBrand",
  "metadata": { "country": "US" }
}
```

**Mongoose model (English):**

```javascript
import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    metadata: Object,
  },
  { timestamps: { createdAt: "created_at" } }
);

export default mongoose.model("Brand", brandSchema);
```

**Relaciones:**

- Una marca puede estar asociada a muchos productos.

---

<a id="producto"></a>

### Producto

Entidad maestra del producto (agrupa publicaciones/variantes).

| Campos       | Descripción (español)                     |
| :----------- | :---------------------------------------- |
| id           | Identificador del producto.               |
| seller_id    | Referencia al vendedor (usuario).         |
| category_id  | Referencia a la categoría.                |
| brand_id     | Referencia a la marca.                    |
| title        | Título del producto.                      |
| subtitle     | Subtítulo opcional.                       |
| description  | Descripción larga.                        |
| condition    | Condición: new, used, refurbished.        |
| status       | Estado: draft, published, paused, closed. |
| published_at | Fecha de publicación.                     |

**SQL syntax (English):**

```sql
CREATE TABLE products (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  seller_id BIGINT UNSIGNED NOT NULL,
  category_id BIGINT UNSIGNED,
  brand_id BIGINT UNSIGNED,
  title VARCHAR(500) NOT NULL,
  subtitle VARCHAR(500),
  description TEXT,
  condition ENUM('new','used','refurbished') DEFAULT 'new',
  status ENUM('draft','published','paused','closed') DEFAULT 'draft',
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL
);
```

**JSON example (English):**

```json
{
  "id": "prod_001",
  "seller_id": "615f1a2b3c4d5e6f7a8b9c0d",
  "category_id": "cat_001",
  "brand_id": "brand_001",
  "title": "Laptop XYZ",
  "subtitle": "16GB RAM, 512GB SSD",
  "description": "High performance laptop",
  "condition": "new",
  "status": "published",
  "published_at": "2024-02-01T10:00:00Z"
}
```

**Mongoose model (English):**

```javascript
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    seller_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    brand_id: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
    title: { type: String, required: true },
    subtitle: String,
    description: String,
    condition: {
      type: String,
      enum: ["new", "used", "refurbished"],
      default: "new",
    },
    status: {
      type: String,
      enum: ["draft", "published", "paused", "closed"],
      default: "draft",
    },
    published_at: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
```

**Relaciones:**

- Un producto pertenece a un vendedor.
- Un producto puede tener múltiples publicaciones (listings).

---

<a id="publicacion"></a>

### Publicacion (Listing)

Oferta concreta de un producto con precio y stock.

| Campos              | Descripción (español)                        |
| :------------------ | :------------------------------------------- |
| id                  | Identificador de la publicación.             |
| product_id          | Referencia al producto maestro.              |
| seller_id           | Referencia al vendedor.                      |
| sku                 | SKU del vendedor.                            |
| external_id         | ID externo del marketplace (opcional).       |
| price               | Precio actual.                               |
| currency            | Moneda.                                      |
| available_quantity  | Cantidad disponible.                         |
| reserved_quantity   | Cantidad reservada.                          |
| warranty            | Información de garantía.                     |
| listing_type        | Tipo de publicación.                         |
| buy_box             | Si participa en buy-box.                     |
| attributes          | Atributos del listing (JSON).                |
| shipping_profile_id | Perfil de envío (FK).                        |
| status              | Estado: active, inactive, deleted, sold_out. |

**SQL syntax (English):**

```sql
CREATE TABLE listings (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id BIGINT UNSIGNED NOT NULL,
  seller_id BIGINT UNSIGNED NOT NULL,
  sku VARCHAR(200),
  external_id VARCHAR(200),
  price DECIMAL(14,2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  available_quantity INT DEFAULT 0,
  reserved_quantity INT DEFAULT 0,
  warranty VARCHAR(255),
  listing_type ENUM('standard','premium','classified') DEFAULT 'standard',
  buy_box BOOLEAN DEFAULT FALSE,
  condition_note VARCHAR(255),
  attributes JSON,
  shipping_profile_id BIGINT UNSIGNED,
  status ENUM('active','inactive','deleted','sold_out') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (shipping_profile_id) REFERENCES shipping_profiles(id) ON DELETE SET NULL
);
```

**JSON example (English):**

```json
{
  "id": "list_001",
  "product_id": "prod_001",
  "seller_id": "615f1a2b3c4d5e6f7a8b9c0d",
  "sku": "XYZ-001",
  "price": 1200.0,
  "currency": "USD",
  "available_quantity": 10,
  "attributes": { "color": "black", "size": "15inch" },
  "status": "active"
}
```

**Mongoose model (English):**

```javascript
import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    seller_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sku: String,
    external_id: String,
    price: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    available_quantity: { type: Number, default: 0 },
    reserved_quantity: { type: Number, default: 0 },
    warranty: String,
    listing_type: {
      type: String,
      enum: ["standard", "premium", "classified"],
      default: "standard",
    },
    buy_box: { type: Boolean, default: false },
    attributes: Object,
    shipping_profile_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShippingProfile",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "deleted", "sold_out"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Listing", listingSchema);
```

**Relaciones:**

- Una publicación pertenece a un producto y a un vendedor.
- Una publicación puede tener variaciones.

---

<a id="variacion-publicacion"></a>

### Variación Publicación (Listing Variation)

Variaciones por atributos (color/talla).

| Campos             | Descripción (español)                |
| :----------------- | :----------------------------------- |
| id                 | Identificador de la variación.       |
| listing_id         | Referencia a la publicación.         |
| sku                | SKU de la variación.                 |
| attribute_values   | Valores de atributos (JSON).         |
| available_quantity | Cantidad disponible de la variación. |
| price              | Precio específico (opcional).        |

**SQL syntax (English):**

```sql
CREATE TABLE listing_variations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  listing_id BIGINT UNSIGNED NOT NULL,
  sku VARCHAR(200),
  attribute_values JSON NOT NULL,
  available_quantity INT DEFAULT 0,
  price DECIMAL(14,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);
```

**JSON example (English):**

```json
{
  "id": "var_001",
  "listing_id": "list_001",
  "sku": "XYZ-001-BLK",
  "attribute_values": { "color": "black", "size": "15inch" },
  "available_quantity": 5,
  "price": 1200.0
}
```

**Mongoose model (English):**

```javascript
import mongoose from "mongoose";

const listingVariationSchema = new mongoose.Schema(
  {
    listing_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    sku: String,
    attribute_values: Object,
    available_quantity: { type: Number, default: 0 },
    price: Number,
  },
  { timestamps: { createdAt: "created_at" } }
);

export default mongoose.model("ListingVariation", listingVariationSchema);
```

**Relaciones:**

- Variación pertenece a una publicación.

---

<a id="imagen"></a>

### Imagen

Imágenes polimórficas para producto, publicación, usuario o marca.

| Campos     | Descripción (español)                             |
| :--------- | :------------------------------------------------ |
| id         | Identificador de la imagen.                       |
| owner_type | Tipo del propietario: product/listing/user/brand. |
| owner_id   | ID del objeto propietario.                        |
| url        | URL de la imagen.                                 |
| alt_text   | Texto alternativo.                                |
| is_primary | Indicador de imagen principal.                    |

**SQL syntax (English):**

```sql
CREATE TABLE images (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  owner_type ENUM('product','listing','user','brand') NOT NULL,
  owner_id BIGINT UNSIGNED NOT NULL,
  url VARCHAR(2000) NOT NULL,
  alt_text VARCHAR(500),
  sort_index INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**JSON example (English):**

```json
{
  "id": "img_001",
  "owner_type": "listing",
  "owner_id": "list_001",
  "url": "https://cdn.example.com/images/xyz.jpg",
  "alt_text": "Laptop front view",
  "is_primary": true
}
```

**Mongoose model (English):**

```javascript
import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    owner_type: {
      type: String,
      enum: ["product", "listing", "user", "brand"],
      required: true,
    },
    owner_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    url: { type: String, required: true },
    alt_text: String,
    sort_index: { type: Number, default: 0 },
    is_primary: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "created_at" } }
);

export default mongoose.model("Image", imageSchema);
```

**Relaciones:**

- Polimórfica: imagen puede pertenecer a producto, publicación, usuario o marca.

---

<a id="perfil-envio"></a>

### Perfil Envío (Shipping Profile)

Perfiles de envío por vendedor.

| Campos        | Descripción (español)                      |
| :------------ | :----------------------------------------- |
| id            | Identificador del perfil de envío.         |
| seller_id     | Vendedor propietario del perfil.           |
| name          | Nombre del perfil (ej. "Estándar").        |
| service_level | Nivel del servicio (standard, express...). |
| price_rules   | Reglas de precios (JSON).                  |
| dimensions    | Dimensiones por defecto (JSON).            |
| enabled       | Si está habilitado.                        |

**SQL syntax (English):**

```sql
CREATE TABLE shipping_profiles (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  seller_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  service_level ENUM('standard','express','same_day','pickup') DEFAULT 'standard',
  price_rules JSON,
  dimensions JSON,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**JSON example (English):**

```json
{
  "id": "sp_001",
  "seller_id": "615f1a2b3c4d5e6f7a8b9c0d",
  "name": "Standard Shipping",
  "service_level": "standard",
  "price_rules": { "region": "AR", "cost": 10.0 },
  "enabled": true
}
```

**Mongoose model (English):**

```javascript
import mongoose from "mongoose";

const shippingProfileSchema = new mongoose.Schema(
  {
    seller_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    service_level: {
      type: String,
      enum: ["standard", "express", "same_day", "pickup"],
      default: "standard",
    },
    price_rules: Object,
    dimensions: Object,
    enabled: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: "created_at" } }
);

export default mongoose.model("ShippingProfile", shippingProfileSchema);
```

**Relaciones:**

- Perfil pertenece a un vendedor.
- Perfil se usa en publicaciones.

---

<a id="opcion-envio"></a>

### Opción Envío (Shipping Option)

Opciones/servicios concretos en un perfil de envío.

| Campos              | Descripción (español)                |
| :------------------ | :----------------------------------- |
| id                  | Identificador de la opción de envío. |
| shipping_profile_id | FK al perfil de envío.               |
| carrier             | Transportista.                       |
| service_code        | Código del servicio.                 |
| min_days            | Días mínimos estimados.              |
| max_days            | Días máximos estimados.              |
| base_cost           | Costo base.                          |

**SQL syntax (English):**

```sql
CREATE TABLE shipping_options (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  shipping_profile_id BIGINT UNSIGNED NOT NULL,
  carrier VARCHAR(255) NOT NULL,
  service_code VARCHAR(255),
  service_name VARCHAR(255),
  min_days INT,
  max_days INT,
  base_cost DECIMAL(14,2),
  currency VARCHAR(10) DEFAULT 'USD',
  metadata JSON,
  FOREIGN KEY (shipping_profile_id) REFERENCES shipping_profiles(id) ON DELETE CASCADE
);
```

**JSON example (English):**

```json
{
  "id": "so_001",
  "shipping_profile_id": "sp_001",
  "carrier": "FastShip",
  "service_code": "FS_EXP",
  "service_name": "Express",
  "min_days": 1,
  "max_days": 2,
  "base_cost": 15.0
}
```

**Mongoose model (English):**

```javascript
import mongoose from "mongoose";

const shippingOptionSchema = new mongoose.Schema({
  shipping_profile_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ShippingProfile",
    required: true,
  },
  carrier: { type: String, required: true },
  service_code: String,
  service_name: String,
  min_days: Number,
  max_days: Number,
  base_cost: Number,
  currency: String,
  metadata: Object,
});

export default mongoose.model("ShippingOption", shippingOptionSchema);
```

**Relaciones:**

- Opción pertenece a un perfil de envío.

---

<a id="transaccion-inventario"></a>

### Transacción Inventario

Historial de cambios de stock por publicación/variación.

| Campos       | Descripción (español)                |
| :----------- | :----------------------------------- |
| id           | Identificador de la transacción.     |
| listing_id   | Publicación afectada.                |
| variation_id | Variación afectada (nullable).       |
| change       | Cambio en cantidad (+/-).            |
| reason       | Motivo del cambio.                   |
| reference_id | Referencia externa (pedido, ajuste). |
| created_at   | Fecha del registro.                  |

**SQL syntax (English):**

```sql
CREATE TABLE inventory_transactions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  listing_id BIGINT UNSIGNED NOT NULL,
  variation_id BIGINT UNSIGNED,
  change INT NOT NULL,
  reason VARCHAR(255),
  reference_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
  FOREIGN KEY (variation_id) REFERENCES listing_variations(id) ON DELETE CASCADE
);
```

**JSON example (English):**

```json
{
  "id": "itx_001",
  "listing_id": "list_001",
  "variation_id": "var_001",
  "change": -1,
  "reason": "order_placed",
  "reference_id": "order_123"
}
```

**Mongoose model (English):**

```javascript
import mongoose from "mongoose";

const inventoryTransactionSchema = new mongoose.Schema(
  {
    listing_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    variation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ListingVariation",
    },
    change: { type: Number, required: true },
    reason: String,
    reference_id: String,
  },
  { timestamps: { createdAt: "created_at" } }
);

export default mongoose.model(
  "InventoryTransaction",
  inventoryTransactionSchema
);
```

**Relaciones:**

- Registros asociados a publicaciones/variaciones.

---

<a id="carrito"></a>

### Carrito

Carrito de compra por usuario (temporal).

| Campos     | Descripción (español)      |
| :--------- | :------------------------- |
| id         | Identificador del carrito. |
| user_id    | Propietario del carrito.   |
| currency   | Moneda del carrito.        |
| created_at | Fecha de creación.         |
| updated_at | Fecha de actualización.    |

**SQL syntax (English):**

```sql
CREATE TABLE carts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**JSON example (English):**

```json
{
  "id": "cart_001",
  "user_id": "615f1a2b3c4d5e6f7a8b9c0d",
  "currency": "USD",
  "created_at": "2024-03-01T12:00:00Z"
}
```

**Mongoose model (English):**

```javascript
import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    currency: { type: String, default: "USD" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model("Cart", cartSchema);
```

**Relaciones:**

- Un usuario puede tener un carrito activo (1:1 o 1:N según diseño).

---

<a id="item-carrito"></a>

### Item Carrito

Ítems dentro del carrito.

| Campos       | Descripción (español)                    |
| :----------- | :--------------------------------------- |
| id           | Identificador del item.                  |
| cart_id      | Carrito al que pertenece.                |
| listing_id   | Publicación agregada.                    |
| variation_id | Variación (opcional).                    |
| quantity     | Cantidad.                                |
| price_at_add | Precio al momento de agregar (snapshot). |

**SQL syntax (English):**

```sql
CREATE TABLE cart_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  cart_id BIGINT UNSIGNED NOT NULL,
  listing_id BIGINT UNSIGNED NOT NULL,
  variation_id BIGINT UNSIGNED,
  quantity INT DEFAULT 1,
  price_at_add DECIMAL(14,2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
  FOREIGN KEY (variation_id) REFERENCES listing_variations(id) ON DELETE SET NULL
);
```

**JSON example (English):**

```json
{
  "id": "ci_001",
  "cart_id": "cart_001",
  "listing_id": "list_001",
  "variation_id": "var_001",
  "quantity": 1,
  "price_at_add": 1200.0,
  "currency": "USD"
}
```

**Mongoose model (English):**

```javascript
import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    cart_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    listing_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    variation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ListingVariation",
    },
    quantity: { type: Number, default: 1 },
    price_at_add: { type: Number, required: true },
    currency: { type: String, default: "USD" },
  },
  { timestamps: { createdAt: "created_at" } }
);

export default mongoose.model("CartItem", cartItemSchema);
```

**Relaciones:**

- Item pertenece a carrito y referencia una publicación.

---

<a id="pedido"></a>

### Pedido (Order)

Registro de compra entre comprador y vendedor.

| Campos              | Descripción (español)                                     |
| :------------------ | :-------------------------------------------------------- |
| id                  | Identificador del pedido.                                 |
| external_order_id   | ID externo (si aplica).                                   |
| buyer_id            | Comprador (usuario).                                      |
| seller_id           | Vendedor (usuario).                                       |
| billing_address_id  | Dirección de facturación.                                 |
| shipping_address_id | Dirección de envío.                                       |
| total_amount        | Importe total.                                            |
| currency            | Moneda.                                                   |
| status              | Estado del pedido (created, paid, shipped, delivered...). |
| payment_status      | Estado del pago.                                          |
| shipping_status     | Estado del envío.                                         |
| placed_at           | Fecha de creación/colocación.                             |

**SQL syntax (English):**

```sql
CREATE TABLE orders (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  external_order_id VARCHAR(255),
  buyer_id BIGINT UNSIGNED NOT NULL,
  seller_id BIGINT UNSIGNED NOT NULL,
  billing_address_id BIGINT UNSIGNED,
  shipping_address_id BIGINT UNSIGNED,
  total_amount DECIMAL(14,2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  status ENUM('created','paid','shipped','delivered','cancelled','refunded','disputed') DEFAULT 'created',
  payment_status ENUM('pending','paid','failed','refunded') DEFAULT 'pending',
  shipping_status ENUM('not_shipped','shipped','in_transit','delivered') DEFAULT 'not_shipped',
  placed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  metadata JSON,
  FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (billing_address_id) REFERENCES addresses(id) ON DELETE SET NULL,
  FOREIGN KEY (shipping_address_id) REFERENCES addresses(id) ON DELETE SET NULL
);
```

**JSON example (English):**

```json
{
  "id": "order_001",
  "buyer_id": "615f1a2b3c4d5e6f7a8b9c0d",
  "seller_id": "615f1a2b3c4d5e6f7a8b9c2f",
  "total_amount": 1200.0,
  "currency": "USD",
  "status": "created",
  "payment_status": "pending",
  "placed_at": "2024-03-10T14:00:00Z"
}
```

**Mongoose model (English):**

```javascript
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    external_order_id: String,
    buyer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seller_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    billing_address_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    shipping_address_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    total_amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    status: {
      type: String,
      enum: [
        "created",
        "paid",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
        "disputed",
      ],
      default: "created",
    },
    payment_status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    shipping_status: {
      type: String,
      enum: ["not_shipped", "shipped", "in_transit", "delivered"],
      default: "not_shipped",
    },
    metadata: Object,
  },
  { timestamps: { createdAt: "placed_at", updatedAt: "updated_at" } }
);

export default mongoose.model("Order", orderSchema);
```

**Relaciones:**

- Pedido tiene múltiples items (order_items).
- Pedido tiene pagos y envíos asociados.
- Relaciona comprador y vendedor.

---

<a id="item-pedido"></a>

### Item Pedido (Order Item)

Líneas del pedido (snapshot del producto/listing).

| Campos            | Descripción (español)                             |
| :---------------- | :------------------------------------------------ |
| id                | Identificador del item.                           |
| order_id          | Pedido al que pertenece.                          |
| listing_id        | Publicación referenciada.                         |
| variation_id      | Variación referenciada (opcional).                |
| product_snapshot  | Snapshot JSON del producto/listing en el momento. |
| quantity          | Cantidad pedida.                                  |
| unit_price        | Precio unitario.                                  |
| discount_amount   | Descuento aplicado.                               |
| total_line_amount | Total de la línea.                                |

**SQL syntax (English):**

```sql
CREATE TABLE order_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  listing_id BIGINT UNSIGNED,
  variation_id BIGINT UNSIGNED,
  product_snapshot JSON NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(14,2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  discount_amount DECIMAL(14,2) DEFAULT 0.00,
  total_line_amount DECIMAL(14,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE SET NULL,
  FOREIGN KEY (variation_id) REFERENCES listing_variations(id) ON DELETE SET NULL
);
```

**JSON example (English):**

```json
{
  "id": "oi_001",
  "order_id": "order_001",
  "listing_id": "list_001",
  "variation_id": "var_001",
  "product_snapshot": { "title": "Laptop XYZ", "sku": "XYZ-001" },
  "quantity": 1,
  "unit_price": 1200.0,
  "currency": "USD",
  "total_line_amount": 1200.0
}
```

**Mongoose model (English):**

```javascript
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  listing_id: { type: mongoose.Schema.Types.ObjectId, ref: "Listing" },
  variation_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ListingVariation",
  },
  product_snapshot: { type: Object, required: true },
  quantity: { type: Number, required: true },
  unit_price: { type: Number, required: true },
  currency: { type: String, required: true },
  discount_amount: { type: Number, default: 0.0 },
  total_line_amount: { type: Number, required: true },
});

export default mongoose.model("OrderItem", orderItemSchema);
```

**Relaciones:**

- Item pertenece a un pedido; referencia una publicación/variación.

---

<a id="pago"></a>

### Pago (Payment)

Registros de interacciones con gateways.

| Campos                  | Descripción (español)                             |
| :---------------------- | :------------------------------------------------ |
| id                      | Identificador del pago.                           |
| order_id                | Pedido asociado.                                  |
| payer_id                | Usuario que paga.                                 |
| payee_id                | Usuario que recibe (vendedor).                    |
| amount                  | Importe.                                          |
| currency                | Moneda.                                           |
| method                  | Método de pago (card, pix, boleto...).            |
| provider                | Proveedor/gateway.                                |
| provider_transaction_id | ID de transacción del proveedor.                  |
| status                  | Estado (initiated, authorized, captured, failed). |
| provider_response       | Respuesta completa del proveedor (JSON).          |

**SQL syntax (English):**

```sql
CREATE TABLE payments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  payer_id BIGINT UNSIGNED NOT NULL,
  payee_id BIGINT UNSIGNED NOT NULL,
  amount DECIMAL(14,2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  method VARCHAR(100) NOT NULL,
  provider VARCHAR(100),
  provider_transaction_id VARCHAR(255),
  status ENUM('initiated','authorized','captured','failed','refunded') DEFAULT 'initiated',
  provider_response JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (payer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (payee_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**JSON example (English):**

```json
{
  "id": "pay_001",
  "order_id": "order_001",
  "payer_id": "615f1a2b3c4d5e6f7a8b9c0d",
  "payee_id": "615f1a2b3c4d5e6f7a8b9c2f",
  "amount": 1200.0,
  "currency": "USD",
  "method": "credit_card",
  "provider": "stripe",
  "provider_transaction_id": "ch_1Example"
}
```

**Mongoose model (English):**

```javascript
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    payer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    payee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    method: String,
    provider: String,
    provider_transaction_id: String,
    status: {
      type: String,
      enum: ["initiated", "authorized", "captured", "failed", "refunded"],
      default: "initiated",
    },
    provider_response: Object,
  },
  { timestamps: { createdAt: "created_at" } }
);

export default mongoose.model("Payment", paymentSchema);
```

**Relaciones:**

- Pago pertenece a un pedido; relaciona pagador y beneficiario.

---

<a id="reembolso"></a>

### Reembolso (Refund)

Registros de devolución de dinero o contracargo.

| Campos       | Descripción (español)        |
| :----------- | :--------------------------- |
| id           | Identificador del reembolso. |
| payment_id   | Pago asociado (opcional).    |
| order_id     | Pedido asociado (opcional).  |
| amount       | Monto reembolsado.           |
| currency     | Moneda.                      |
| reason       | Motivo.                      |
| status       | Estado del reembolso.        |
| processed_at | Fecha de procesamiento.      |

**SQL syntax (English):**

```sql
CREATE TABLE refunds (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  payment_id BIGINT UNSIGNED,
  order_id BIGINT UNSIGNED,
  amount DECIMAL(14,2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  reason VARCHAR(255),
  status ENUM('requested','approved','rejected','processed') DEFAULT 'requested',
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);
```

**JSON example (English):**

```json
{
  "id": "ref_001",
  "payment_id": "pay_001",
  "order_id": "order_001",
  "amount": 1200.0,
  "currency": "USD",
  "reason": "item_not_as_described",
  "status": "requested"
}
```

**Mongoose model (English):**

```javascript
import mongoose from "mongoose";

const refundSchema = new mongoose.Schema(
  {
    payment_id: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    reason: String,
    status: {
      type: String,
      enum: ["requested", "approved", "rejected", "processed"],
      default: "requested",
    },
    processed_at: Date,
  },
  { timestamps: { createdAt: "created_at" } }
);

export default mongoose.model("Refund", refundSchema);
```

**Relaciones:**

- Reembolso puede referenciar pago y pedido.

---

<a id="envio"></a>

### Envío (Shipment)

Información de logística y tracking de un pedido.

| Campos            | Descripción (español)    |
| :---------------- | :----------------------- |
| id                | Identificador del envío. |
| order_id          | Pedido asociado.         |
| shipment_provider | Transportista.           |
| service           | Servicio elegido.        |
| tracking_number   | Número de seguimiento.   |
| label_url         | URL de la etiqueta.      |
| status            | Estado del envío.        |
| shipped_at        | Fecha de envío.          |
| delivered_at      | Fecha de entrega.        |

**SQL syntax (English):**

```sql
CREATE TABLE shipments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  shipment_provider VARCHAR(255),
  service VARCHAR(255),
  tracking_number VARCHAR(255),
  label_url VARCHAR(2000),
  status ENUM('pending','shipped','in_transit','out_for_delivery','delivered','exception') DEFAULT 'pending',
  shipped_at TIMESTAMP,
  delivered_at TIMESTAMP,
  estimated_delivery_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

**JSON example (English):**

```json
{
  "id": "ship_001",
  "order_id": "order_001",
  "shipment_provider": "FastShip",
  "service": "Express",
  "tracking_number": "TRACK123",
  "status": "shipped",
  "shipped_at": "2024-03-11T08:00:00Z"
}
```

**Mongoose model (English):**

```javascript
import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    shipment_provider: String,
    service: String,
    tracking_number: String,
    label_url: String,
    status: {
      type: String,
      enum: [
        "pending",
        "shipped",
        "in_transit",
        "out_for_delivery",
        "delivered",
        "exception",
      ],
      default: "pending",
    },
    shipped_at: Date,
    delivered_at: Date,
    estimated_delivery_at: Date,
  },
  { timestamps: { createdAt: "created_at" } }
);

export default mongoose.model("Shipment", shipmentSchema);
```

**Relaciones:**

- Un pedido puede tener uno o varios envíos (split shipments).

---

<a id="pregunta-producto"></a>

### Pregunta Producto (Product Question)

Q&A para productos.

| Campos     | Descripción (español)             |
| :--------- | :-------------------------------- |
| id         | Identificador de la pregunta.     |
| product_id | Producto consultado.              |
| user_id    | Usuario que pregunta.             |
| title      | Título de la pregunta (opcional). |
| body       | Texto de la pregunta.             |
| status     | Estado: open, answered, closed.   |

**SQL syntax (English):**

```sql
CREATE TABLE product_questions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(500),
  body TEXT NOT NULL,
  status ENUM('open','answered','closed') DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**JSON example (English):**

```json
{
  "id": "q_001",
  "product_id": "prod_001",
  "user_id": "615f1a2b3c4d5e6f7a8b9c0d",
  "title": "Does it include charger?",
  "body": "Is the power adapter included in the box?"
}
```

**Mongoose model (English):**

```javascript
import mongoose from "mongoose";

const productQuestionSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: String,
    body: { type: String, required: true },
    status: {
      type: String,
      enum: ["open", "answered", "closed"],
      default: "open",
    },
  },
  { timestamps: true }
);

export default mongoose.model("ProductQuestion", productQuestionSchema);
```

**Relaciones:**

- Una pregunta pertenece a un producto y a un usuario.
- Puede tener varias respuestas.

---

<a id="respuesta-producto"></a>

### Respuesta Producto (Product Answer)

Respuesta a una pregunta de producto.

| Campos      | Descripción (español)                      |
| :---------- | :----------------------------------------- |
| id          | Identificador de la respuesta.             |
| question_id | Pregunta asociada.                         |
| user_id     | Usuario que responde (puede ser vendedor). |
| body        | Texto de la respuesta.                     |

**SQL syntax (English):**

```sql
CREATE TABLE product_answers (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  question_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES product_questions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**JSON example (English):**

```json
{
  "id": "pa_001",
  "question_id": "q_001",
  "user_id": "615f1a2b3c4d5e6f7a8b9c2f",
  "body": "Yes, the charger is included."
}
```

**Mongoose model (English):**

```javascript
import mongoose from "mongoose";

const productAnswerSchema = new mongoose.Schema(
  {
    question_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductQuestion",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    body: { type: String, required: true },
  },
  { timestamps: { createdAt: "created_at" } }
);

export default mongoose.model("ProductAnswer", productAnswerSchema);
```

**Relaciones:**

- Respuesta pertenece a una pregunta y a un usuario.

---

<a id="mensaje"></a>

### Mensaje (Message)

Mensajería privada entre usuarios (buyer/seller inbox).

| Campos       | Descripción (español)       |
| :----------- | :-------------------------- |
| id           | Identificador del mensaje.  |
| from_user_id | Emisor (usuario).           |
| to_user_id   | Receptor (usuario).         |
| order_id     | Pedido asociado (opcional). |
| subject      | Asunto (opcional).          |
| body         | Contenido del mensaje.      |
| read_at      | Fecha de lectura.           |

**SQL syntax (English):**

```sql
CREATE TABLE messages (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  from_user_id BIGINT UNSIGNED NOT NULL,
  to_user_id BIGINT UNSIGNED NOT NULL,
  order_id BIGINT UNSIGNED,
  subject VARCHAR(500),
  body TEXT NOT NULL,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);
```

**JSON example (English):**

```json
{
  "id": "msg_001",
  "from_user_id": "615f1a2b3c4d5e6f7a8b9c0d",
  "to_user_id": "615f1a2b3c4d5e6f7a8b9c2f",
  "subject": "Question about product",
  "body": "Is the item available?"
}
```

**Mongoose model (English):**

```javascript
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    from_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    subject: String,
    body: { type: String, required: true },
    read_at: Date,
  },
  { timestamps: { createdAt: "created_at" } }
);

export default mongoose.model("Message", messageSchema);
```

**Relaciones:**

- Mensajes relacionan dos usuarios; opcionalmente referencian un pedido.

---

<a id="resena"></a>

### Reseña (Review)

Calificación y comentario entre usuarios (habitualmente comprador → vendedor).

| Campos           | Descripción (español)              |
| :--------------- | :--------------------------------- |
| id               | Identificador de la reseña.        |
| reviewer_id      | Usuario que califica.              |
| reviewed_user_id | Usuario calificado (vendedor).     |
| order_id         | Pedido relacionado (opcional).     |
| rating           | Calificación numérica entre 1 y 5. |
| title            | Título de la reseña.               |
| comment          | Comentario de texto.               |

**SQL syntax (English):**

```sql
CREATE TABLE reviews (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  reviewer_id BIGINT UNSIGNED NOT NULL,
  reviewed_user_id BIGINT UNSIGNED NOT NULL,
  order_id BIGINT UNSIGNED,
  rating TINYINT UNSIGNED NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title VARCHAR(255),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);
```

**JSON example (English):**

```json
{
  "id": "rev_001",
  "reviewer_id": "615f1a2b3c4d5e6f7a8b9c0d",
  "reviewed_user_id": "615f1a2b3c4d5e6f7a8b9c2f",
  "order_id": "order_001",
  "rating": 5,
  "title": "Great seller",
  "comment": "Fast shipping and item as described."
}
```

**Mongoose model (English):**

```javascript
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    reviewer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewed_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    rating: { type: Number, min: 1, max: 5, required: true },
    title: String,
    comment: String,
  },
  { timestamps: { createdAt: "created_at" } }
);

export default mongoose.model("Review", reviewSchema);
```

**Relaciones:**

- Reseña conecta calificador y calificado, opcionalmente ligada a un pedido.

---

<a id="disputa"></a>

### Disputa (Dispute)

Reclamos y resolución entre comprador y vendedor.

| Campos       | Descripción (español)                                  |
| :----------- | :----------------------------------------------------- |
| id           | Identificador de la disputa.                           |
| order_id     | Pedido asociado.                                       |
| opener_id    | Usuario que abre la disputa.                           |
| responder_id | Usuario que responde.                                  |
| dispute_type | Tipo de disputa (item_not_received, not_as_described). |
| status       | Estado de la disputa.                                  |
| details      | Detalles adicionales.                                  |
| resolution   | Resultado/resolución (JSON).                           |

**SQL syntax (English):**

```sql
CREATE TABLE disputes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  opener_id BIGINT UNSIGNED NOT NULL,
  responder_id BIGINT UNSIGNED NOT NULL,
  dispute_type VARCHAR(100),
  status ENUM('open','under_review','resolved','rejected') DEFAULT 'open',
  details TEXT,
  resolution JSON,
  opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  closed_at TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (opener_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (responder_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**JSON example (English):**

```json
{
  "id": "d_001",
  "order_id": "order_001",
  "opener_id": "615f1a2b3c4d5e6f7a8b9c0d",
  "responder_id": "615f1a2b3c4d5e6f7a8b9c2f",
  "dispute_type": "item_not_received",
  "status": "open",
  "details": "Item not delivered after 30 days."
}
```

**Mongoose model (English):**

```javascript
import mongoose from "mongoose";

const disputeSchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  opener_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  responder_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dispute_type: String,
  status: {
    type: String,
    enum: ["open", "under_review", "resolved", "rejected"],
    default: "open",
  },
  details: String,
  resolution: Object,
  opened_at: { type: Date, default: Date.now },
  closed_at: Date,
});

export default mongoose.model("Dispute", disputeSchema);
```

**Relaciones:**

- Disputa pertenece a un pedido y a dos usuarios (iniciador y respondedor).

---

<a id="promocion"></a>

### Promoción (Promotion)

Cupones y promociones ofrecidas por vendedores o plataforma.

| Campos         | Descripción (español)                                   |
| :------------- | :------------------------------------------------------ |
| id             | Identificador de la promoción.                          |
| seller_id      | Vendedor asociado (nullable para promociones globales). |
| name           | Nombre de la promoción.                                 |
| code           | Código del cupón (opcional, único).                     |
| promotion_type | Tipo: percentage, fixed_amount, free_shipping, etc.     |
| value          | Valor numérico de la promoción.                         |
| conditions     | Condiciones en JSON.                                    |
| valid_from     | Fecha inicio.                                           |
| valid_to       | Fecha fin.                                              |
| active         | Si está activa.                                         |

**SQL syntax (English):**

```sql
CREATE TABLE promotions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  seller_id BIGINT UNSIGNED,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(100) UNIQUE,
  promotion_type ENUM('percentage','fixed_amount','free_shipping','buy_x_get_y') NOT NULL,
  value DECIMAL(14,4),
  conditions JSON,
  valid_from TIMESTAMP,
  valid_to TIMESTAMP,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE SET NULL
);
```

**JSON example (English):**

```json
{
  "id": "promo_001",
  "seller_id": "615f1a2b3c4d5e6f7a8b9c2f",
  "name": "10% OFF",
  "code": "SAVE10",
  "promotion_type": "percentage",
  "value": 10.0,
  "valid_from": "2024-04-01T00:00:00Z",
  "valid_to": "2024-04-30T23:59:59Z",
  "active": true
}
```

**Mongoose model (English):**

```javascript
import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema(
  {
    seller_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    code: { type: String, unique: true },
    promotion_type: {
      type: String,
      enum: ["percentage", "fixed_amount", "free_shipping", "buy_x_get_y"],
      required: true,
    },
    value: Number,
    conditions: Object,
    valid_from: Date,
    valid_to: Date,
    active: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: "created_at" } }
);

export default mongoose.model("Promotion", promotionSchema);
```

**Relaciones:**

- Puede pertenecer a un vendedor o ser global.
- Se aplica a pedidos/items según lógica de negocio.

---

<a id="metodo-pago"></a>

### Método Pago (Payment Method)

Métodos de pago guardados por usuario (tokens).

| Campos      | Descripción (español)                        |
| :---------- | :------------------------------------------- |
| id          | Identificador del método.                    |
| user_id     | Usuario propietario.                         |
| method_type | Tipo de método (card, bank_account, pix...). |
| provider    | Proveedor (stripe, mercadopago, etc.).       |
| token       | Tokenizado / reference.                      |
| details     | Detalles en JSON.                            |
| is_primary  | Indicador de método principal.               |

**SQL syntax (English):**

```sql
CREATE TABLE payment_methods (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  method_type VARCHAR(100) NOT NULL,
  provider VARCHAR(100),
  token VARCHAR(500),
  details JSON,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**JSON example (English):**

```json
{
  "id": "pm_001",
  "user_id": "615f1a2b3c4d5e6f7a8b9c0d",
  "method_type": "card",
  "provider": "stripe",
  "token": "tok_1Example",
  "is_primary": true
}
```

**Mongoose model (English):**

```javascript
import mongoose from "mongoose";

const paymentMethodSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    method_type: { type: String, required: true },
    provider: String,
    token: String,
    details: Object,
    is_primary: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "created_at" } }
);

export default mongoose.model("PaymentMethod", paymentMethodSchema);
```

**Relaciones:**

- Método pertenece a un usuario.

---

<a id="cartera"></a>

### Cartera (Wallet)

Billetera interna tipo MercadoPago.

| Campos            | Descripción (español)        |
| :---------------- | :--------------------------- |
| id                | Identificador de la cartera. |
| user_id           | Propietario.                 |
| currency          | Moneda de la cartera.        |
| available_balance | Saldo disponible.            |
| pending_balance   | Saldo en proceso.            |

**SQL syntax (English):**

```sql
CREATE TABLE wallets (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  available_balance DECIMAL(18,4) DEFAULT 0.0000,
  pending_balance DECIMAL(18,4) DEFAULT 0.0000,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**JSON example (English):**

```json
{
  "id": "wallet_001",
  "user_id": "615f1a2b3c4d5e6f7a8b9c0d",
  "currency": "USD",
  "available_balance": 250.0,
  "pending_balance": 10.0
}
```

**Mongoose model (English):**

```javascript
import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    currency: { type: String, default: "USD" },
    available_balance: { type: Number, default: 0.0 },
    pending_balance: { type: Number, default: 0.0 },
  },
  { timestamps: { createdAt: "created_at" } }
);

export default mongoose.model("Wallet", walletSchema);
```

**Relaciones:**

- Cartera pertenece a un usuario.

---

<a id="transaccion-cartera"></a>

### Transacción Cartera (Wallet Transaction)

Movimientos dentro de una cartera.

| Campos    | Descripción (español)            |
| :-------- | :------------------------------- |
| id        | Identificador de la transacción. |
| wallet_id | Cartera afectada.                |
| amount    | Monto.                           |
| currency  | Moneda.                          |
| txn_type  | Tipo: credit/debit.              |
| reference | Referencia externa.              |

**SQL syntax (English):**

```sql
CREATE TABLE wallet_transactions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  wallet_id BIGINT UNSIGNED NOT NULL,
  amount DECIMAL(18,4) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  txn_type ENUM('credit','debit') NOT NULL,
  reference VARCHAR(255),
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE
);
```

**JSON example (English):**

```json
{
  "id": "wt_001",
  "wallet_id": "wallet_001",
  "amount": 250.0,
  "currency": "USD",
  "txn_type": "credit",
  "reference": "pay_001"
}
```

**Mongoose model (English):**

```javascript
import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema(
  {
    wallet_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    txn_type: { type: String, enum: ["credit", "debit"], required: true },
    reference: String,
    metadata: Object,
  },
  { timestamps: { createdAt: "created_at" } }
);

export default mongoose.model("WalletTransaction", walletTransactionSchema);
```

**Relaciones:**

- Transacción pertenece a una cartera.

---

<a id="metricas-vendedor"></a>

### Métricas Vendedor (Seller Metrics)

Snapshots diarios para métricas del vendedor.

| Campos                | Descripción (español)       |
| :-------------------- | :-------------------------- |
| id                    | Identificador del registro. |
| seller_id             | Vendedor asociado.          |
| metric_date           | Fecha de la métrica.        |
| sales_count           | Cantidad de ventas.         |
| cancellations         | Cancelaciones.              |
| on_time_shipping_rate | Tasa de envío a tiempo.     |
| average_rating        | Calificación promedio.      |
| raw                   | Datos crudos en JSON.       |

**SQL syntax (English):**

```sql
CREATE TABLE seller_metrics (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  seller_id BIGINT UNSIGNED NOT NULL,
  metric_date DATE NOT NULL,
  sales_count INT DEFAULT 0,
  cancellations INT DEFAULT 0,
  on_time_shipping_rate DECIMAL(5,2),
  average_rating DECIMAL(3,2),
  raw JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY (seller_id, metric_date),
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**JSON example (English):**

```json
{
  "id": "sm_2024_03_01",
  "seller_id": "615f1a2b3c4d5e6f7a8b9c2f",
  "metric_date": "2024-03-01",
  "sales_count": 10,
  "cancellations": 1,
  "on_time_shipping_rate": 95.0,
  "average_rating": 4.8
}
```

**Mongoose model (English):**

```javascript
import mongoose from "mongoose";

const sellerMetricsSchema = new mongoose.Schema(
  {
    seller_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    metric_date: { type: Date, required: true },
    sales_count: { type: Number, default: 0 },
    cancellations: { type: Number, default: 0 },
    on_time_shipping_rate: Number,
    average_rating: Number,
    raw: Object,
  },
  { timestamps: { createdAt: "created_at" } }
);

sellerMetricsSchema.index({ seller_id: 1, metric_date: 1 }, { unique: true });

export default mongoose.model("SellerMetric", sellerMetricsSchema);
```

**Relaciones:**

- Métrica pertenece a un vendedor.

---

<a id="registro-auditoria"></a>
<a id="registro-auditoria"></a>

### Registro Auditoría (Audit Log)

Registro de acciones y eventos para trazabilidad.

| Campos        | Descripción (español)                     |
| :------------ | :---------------------------------------- |
| id            | Identificador del log.                    |
| actor_user_id | Usuario que realizó la acción (nullable). |
| action        | Acción realizada (string).                |
| object_type   | Tipo de objeto afectado.                  |
| object_id     | ID del objeto afectado.                   |
| details       | Datos adicionales (JSON).                 |
| ip_address    | IP desde donde se realizó la acción.      |
| user_agent    | User agent del actor.                     |
| created_at    | Fecha del evento.                         |

**SQL syntax (English):**

```sql
CREATE TABLE audit_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  actor_user_id BIGINT UNSIGNED,
  action VARCHAR(255) NOT NULL,
  object_type VARCHAR(100),
  object_id VARCHAR(255),
  details JSON,
  ip_address VARCHAR(100),
  user_agent VARCHAR(1000),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

**JSON example (English):**

```json
{
  "id": "al_001",
  "actor_user_id": "615f1a2b3c4d5e6f7a8b9c0d",
  "action": "update_listing",
  "object_type": "listing",
  "object_id": "list_001",
  "details": { "changes": ["price"] },
  "ip_address": "192.0.2.1"
}
```

**Mongoose model (English):**

```javascript
import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    actor_user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true },
    object_type: String,
    object_id: String,
    details: Object,
    ip_address: String,
    user_agent: String,
  },
  { timestamps: { createdAt: "created_at" } }
);

export default mongoose.model("AuditLog", auditLogSchema);
```

**Relaciones:**

- Opcionalmente se referencia el usuario actor.

---

## Resumen de Relaciones

- Usuario: puede tener varias Direcciones, PerfilUsuario, Publicaciones, Pedidos, Pagos y Reseñas.
- Dirección: pertenece a un Usuario.
- Producto: pertenece a un Vendedor (User) y tiene Publicaciones.
- Publicación: pertenece a un Producto y puede tener Variaciones y Transacciones de Inventario.
- Pedido: relaciona Buyer y Seller; tiene OrderItems, Payments y Shipments.
- Otros: ver relaciones en cada sección anterior.

[Diagrama](EstructuraDeDatos.mmd)

---