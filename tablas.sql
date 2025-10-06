-- Esquema de base de datos tipo de tienda e-commerce con tablas y campos en español
-- Charset y motor orientados a MySQL / MariaDB (ajustar tipos para otros RDBMS)
SET
FOREIGN_KEY_CHECKS = 0;

-- Usuarios (compradores y vendedores)
CREATE TABLE User
(
    Id          INT UNSIGNED AUTO_INCREMENT,
    Name        VARCHAR(50) NOT NULL,
    Public_Name VARCHAR(50) NOT NULL,
    Email       VARCHAR(100) UNIQUE NOT NULL,
    Password    VARCHAR(255) NOT NULL,
    Status      ENUM('activo','suspendido','eliminado','pendiente') NOT NULL DEFAULT 'activo'
);

CREATE TABLE Vendedor
(

)

-- Direcciones guardadas (envio / facturacion)
CREATE TABLE direcciones
(
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id      BIGINT UNSIGNED NOT NULL,
    calle           VARCHAR(255),
    numero          VARCHAR(50),
    ciudad          VARCHAR(200),
    codigo_postal   VARCHAR(50),
    pais            VARCHAR(100),
    geo_lat         DECIMAL(10, 7),
    geo_lon         DECIMAL(10, 7),
    creado_en       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Categorias (jerarquicas)
CREATE TABLE categorias
(
    id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    padre_id          BIGINT UNSIGNED NULL,
    nombre            VARCHAR(255) NOT NULL,
    slug              VARCHAR(255),
    ruta              VARCHAR(2000),
    esquema_atributos JSON NULL,
    activo            BOOLEAN      NOT NULL DEFAULT TRUE,
    creado_en         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (padre_id) REFERENCES categorias (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Marcas / fabricantes
CREATE TABLE marcas
(
    id        BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre    VARCHAR(255) NOT NULL UNIQUE,
    metadatos JSON NULL,
    creado_en TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Producto maestro (agrupacion definida por el vendedor)
CREATE TABLE productos
(
    id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vendedor_id    BIGINT UNSIGNED NOT NULL,
    categoria_id   BIGINT UNSIGNED NULL,
    marca_id       BIGINT UNSIGNED NULL,
    titulo         VARCHAR(500) NOT NULL,
    subtitulo      VARCHAR(500),
    descripcion    TEXT,
    condicion      ENUM('nuevo','usado','reacondicionado') NOT NULL DEFAULT 'nuevo',
    estado         ENUM('borrador','publicado','pausado','cerrado') NOT NULL DEFAULT 'borrador',
    publicado_en   TIMESTAMP NULL,
    creado_en      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vendedor_id) REFERENCES usuarios (id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES categorias (id) ON DELETE SET NULL,
    FOREIGN KEY (marca_id) REFERENCES marcas (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Publicaciones / ofertas individuales (un producto puede tener varias publicaciones o SKUs)
CREATE TABLE publicaciones
(
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    producto_id         BIGINT UNSIGNED NOT NULL,
    vendedor_id         BIGINT UNSIGNED NOT NULL,
    sku                 VARCHAR(200) NULL,
    id_externo          VARCHAR(200) NULL,
    precio              DECIMAL(14, 2) NOT NULL,
    moneda              VARCHAR(10)    NOT NULL DEFAULT 'USD',
    cantidad_disponible INT            NOT NULL DEFAULT 0,
    cantidad_reservada  INT            NOT NULL DEFAULT 0,
    garantia            VARCHAR(255) NULL,
    tipo_publicacion    ENUM('estandar','premium','clasificado') NOT NULL DEFAULT 'estandar',
    es_buy_box          BOOLEAN        NOT NULL DEFAULT FALSE,
    nota_condicion      VARCHAR(255),
    atributos           JSON NULL,
    perfil_envio_id     BIGINT UNSIGNED NULL,
    estado              ENUM('activo','inactivo','eliminado','agotado') NOT NULL DEFAULT 'activo',
    creado_en           TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos (id) ON DELETE CASCADE,
    FOREIGN KEY (vendedor_id) REFERENCES usuarios (id) ON DELETE CASCADE,
    FOREIGN KEY (perfil_envio_id) REFERENCES perfiles_envio (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Variaciones para publicaciones (combinaciones como talla/color)
CREATE TABLE variaciones_publicacion
(
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    publicacion_id      BIGINT UNSIGNED NOT NULL,
    sku                 VARCHAR(200) NULL,
    valores_atributos   JSON      NOT NULL,
    cantidad_disponible INT       NOT NULL DEFAULT 0,
    precio              DECIMAL(14, 2) NULL,
    creado_en           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (publicacion_id) REFERENCES publicaciones (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Imagenes (pueden pertenecer a producto, publicacion, usuario o marca)
CREATE TABLE imagenes
(
    id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tipo_propietario  ENUM('producto','publicacion','usuario','marca') NOT NULL,
    propietario_id    BIGINT UNSIGNED NOT NULL,
    url               VARCHAR(2000) NOT NULL,
    texto_alternativo VARCHAR(500),
    indice_orden      INT                    DEFAULT 0,
    es_principal      BOOLEAN                DEFAULT FALSE,
    creado_en         TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Perfiles de envio por vendedor
CREATE TABLE perfiles_envio
(
    id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vendedor_id    BIGINT UNSIGNED NOT NULL,
    nombre         VARCHAR(255) NOT NULL,
    nivel_servicio ENUM('estandar','express','mismo_dia','retirada') DEFAULT 'estandar',
    reglas_precio  JSON NULL,
    dimensiones    JSON NULL,
    habilitado     BOOLEAN      NOT NULL DEFAULT TRUE,
    creado_en      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendedor_id) REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Opciones de envio disponibles en un perfil
CREATE TABLE opciones_envio
(
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    perfil_envio_id BIGINT UNSIGNED NOT NULL,
    transportista   VARCHAR(255) NOT NULL,
    codigo_servicio VARCHAR(255) NULL,
    nombre_servicio VARCHAR(255),
    dias_min        INT,
    dias_max        INT,
    costo_base      DECIMAL(14, 2),
    moneda          VARCHAR(10) DEFAULT 'USD',
    metadatos       JSON NULL,
    FOREIGN KEY (perfil_envio_id) REFERENCES perfiles_envio (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Transacciones de inventario (historial de cambios de stock)
CREATE TABLE transacciones_inventario
(
    id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    publicacion_id BIGINT UNSIGNED NOT NULL,
    variacion_id   BIGINT UNSIGNED NULL,
    cambio         INT       NOT NULL,
    motivo         VARCHAR(255),
    referencia_id  VARCHAR(255),
    creado_en      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (publicacion_id) REFERENCES publicaciones (id) ON DELETE CASCADE,
    FOREIGN KEY (variacion_id) REFERENCES variaciones_publicacion (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Carritos de compra
CREATE TABLE carritos
(
    id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id     BIGINT UNSIGNED NOT NULL,
    moneda         VARCHAR(10)        DEFAULT 'USD',
    creado_en      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE items_carrito
(
    id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    carrito_id        BIGINT UNSIGNED NOT NULL,
    publicacion_id    BIGINT UNSIGNED NOT NULL,
    variacion_id      BIGINT UNSIGNED NULL,
    cantidad          INT            NOT NULL DEFAULT 1,
    precio_al_agregar DECIMAL(14, 2) NOT NULL,
    moneda            VARCHAR(10)    NOT NULL DEFAULT 'USD',
    creado_en         TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (carrito_id) REFERENCES carritos (id) ON DELETE CASCADE,
    FOREIGN KEY (publicacion_id) REFERENCES publicaciones (id) ON DELETE CASCADE,
    FOREIGN KEY (variacion_id) REFERENCES variaciones_publicacion (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Pedidos
CREATE TABLE pedidos
(
    id                       BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_externo_pedido        VARCHAR(255) NULL,
    comprador_id             BIGINT UNSIGNED NOT NULL,
    vendedor_id              BIGINT UNSIGNED NOT NULL,
    direccion_facturacion_id BIGINT UNSIGNED NULL,
    direccion_envio_id       BIGINT UNSIGNED NULL,
    monto_total              DECIMAL(14, 2) NOT NULL,
    moneda                   VARCHAR(10)    NOT NULL DEFAULT 'USD',
    estado                   ENUM('creado','pagado','enviado','entregado','cancelado','reembolsado','en_disputa') NOT NULL DEFAULT 'creado',
    estado_pago              ENUM('pendiente','pagado','fallido','reembolsado') NOT NULL DEFAULT 'pendiente',
    estado_envio             ENUM('no_enviado','enviado','en_transito','entregado') NOT NULL DEFAULT 'no_enviado',
    fecha_pedido             TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en           TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    metadatos                JSON NULL,
    FOREIGN KEY (comprador_id) REFERENCES usuarios (id) ON DELETE CASCADE,
    FOREIGN KEY (vendedor_id) REFERENCES usuarios (id) ON DELETE CASCADE,
    FOREIGN KEY (direccion_facturacion_id) REFERENCES direcciones (id) ON DELETE SET NULL,
    FOREIGN KEY (direccion_envio_id) REFERENCES direcciones (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE items_pedido
(
    id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    pedido_id         BIGINT UNSIGNED NOT NULL,
    publicacion_id    BIGINT UNSIGNED NOT NULL,
    variacion_id      BIGINT UNSIGNED NULL,
    snapshot_producto JSON           NOT NULL,
    cantidad          INT            NOT NULL,
    precio_unitario   DECIMAL(14, 2) NOT NULL,
    moneda            VARCHAR(10)    NOT NULL,
    monto_descuento   DECIMAL(14, 2) DEFAULT 0.00,
    monto_total_linea DECIMAL(14, 2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos (id) ON DELETE CASCADE,
    FOREIGN KEY (publicacion_id) REFERENCES publicaciones (id) ON DELETE SET NULL,
    FOREIGN KEY (variacion_id) REFERENCES variaciones_publicacion (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Pagos (interacciones con gateways)
CREATE TABLE pagos
(
    id                       BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    pedido_id                BIGINT UNSIGNED NOT NULL,
    pagador_id               BIGINT UNSIGNED NOT NULL,
    beneficiario_id          BIGINT UNSIGNED NOT NULL,
    monto                    DECIMAL(14, 2) NOT NULL,
    moneda                   VARCHAR(10)    NOT NULL DEFAULT 'USD',
    metodo                   VARCHAR(100)   NOT NULL,
    proveedor                VARCHAR(100) NULL,
    id_transaccion_proveedor VARCHAR(255) NULL,
    estado                   ENUM('iniciado','autorizado','capturado','fallido','reembolsado') NOT NULL DEFAULT 'iniciado',
    respuesta_proveedor      JSON NULL,
    creado_en                TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedidos (id) ON DELETE CASCADE,
    FOREIGN KEY (pagador_id) REFERENCES usuarios (id) ON DELETE CASCADE,
    FOREIGN KEY (beneficiario_id) REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Reembolsos / contracargos
CREATE TABLE reembolsos
(
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    pago_id      BIGINT UNSIGNED NULL,
    pedido_id    BIGINT UNSIGNED NULL,
    monto        DECIMAL(14, 2) NOT NULL,
    moneda       VARCHAR(10)    NOT NULL DEFAULT 'USD',
    motivo       VARCHAR(255),
    estado       ENUM('solicitado','aprobado','rechazado','procesado') NOT NULL DEFAULT 'solicitado',
    procesado_en TIMESTAMP NULL,
    creado_en    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pago_id) REFERENCES pagos (id) ON DELETE SET NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Envios / seguimiento
CREATE TABLE envios
(
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    pedido_id           BIGINT UNSIGNED NOT NULL,
    proveedor_envio     VARCHAR(255) NULL,
    servicio            VARCHAR(255) NULL,
    numero_seguimiento  VARCHAR(255) NULL,
    url_etiqueta        VARCHAR(2000) NULL,
    estado              ENUM('pendiente','enviado','en_transito','en_reparto','entregado','excepcion') DEFAULT 'pendiente',
    enviado_en          TIMESTAMP NULL,
    entregado_en        TIMESTAMP NULL,
    entrega_estimada_en TIMESTAMP NULL,
    creado_en           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedidos (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Preguntas y respuestas (Q&A)
CREATE TABLE preguntas_producto
(
    id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    producto_id    BIGINT UNSIGNED NOT NULL,
    usuario_id     BIGINT UNSIGNED NOT NULL,
    titulo         VARCHAR(500),
    cuerpo         TEXT      NOT NULL,
    estado         ENUM('abierta','respondida','cerrada') DEFAULT 'abierta',
    creado_en      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos (id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE respuestas_producto
(
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    pregunta_id BIGINT UNSIGNED NOT NULL,
    usuario_id  BIGINT UNSIGNED NOT NULL,
    cuerpo      TEXT      NOT NULL,
    creado_en   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pregunta_id) REFERENCES preguntas_producto (id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Mensajeria entre comprador y vendedor
CREATE TABLE mensajes
(
    id                 BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_origen_id  BIGINT UNSIGNED NOT NULL,
    usuario_destino_id BIGINT UNSIGNED NOT NULL,
    pedido_id          BIGINT UNSIGNED NULL,
    asunto             VARCHAR(500),
    cuerpo             TEXT      NOT NULL,
    leido_en           TIMESTAMP NULL,
    creado_en          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_origen_id) REFERENCES usuarios (id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_destino_id) REFERENCES usuarios (id) ON DELETE CASCADE,
    FOREIGN KEY (pedido_id) REFERENCES pedidos (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Resenas y calificaciones
CREATE TABLE resenas
(
    id                     BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_calificador_id BIGINT UNSIGNED NOT NULL,
    usuario_calificado_id  BIGINT UNSIGNED NOT NULL,
    pedido_id              BIGINT UNSIGNED NULL,
    calificacion           TINYINT UNSIGNED NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
    titulo                 VARCHAR(255),
    comentario             TEXT,
    creado_en              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_calificador_id) REFERENCES usuarios (id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_calificado_id) REFERENCES usuarios (id) ON DELETE CASCADE,
    FOREIGN KEY (pedido_id) REFERENCES pedidos (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Disputas / reclamos
CREATE TABLE disputas
(
    id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    pedido_id      BIGINT UNSIGNED NOT NULL,
    iniciador_id   BIGINT UNSIGNED NOT NULL,
    respondedor_id BIGINT UNSIGNED NOT NULL,
    tipo_disputa   VARCHAR(100),
    estado         ENUM('abierta','en_revision','resuelta','rechazada') DEFAULT 'abierta',
    detalles       TEXT,
    resolucion     JSON NULL,
    abierto_en     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cerrado_en     TIMESTAMP NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos (id) ON DELETE CASCADE,
    FOREIGN KEY (iniciador_id) REFERENCES usuarios (id) ON DELETE CASCADE,
    FOREIGN KEY (respondedor_id) REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Promociones y cupones
CREATE TABLE promociones
(
    id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vendedor_id    BIGINT UNSIGNED NULL,
    nombre         VARCHAR(255) NOT NULL,
    codigo         VARCHAR(100) NULL UNIQUE,
    tipo_promocion ENUM('porcentaje','monto_fijo','envio_gratis','compra_x_lleva_y') NOT NULL,
    valor          DECIMAL(14, 4) NULL,
    condiciones    JSON NULL,
    valido_desde   TIMESTAMP NULL,
    valido_hasta   TIMESTAMP NULL,
    activo         BOOLEAN               DEFAULT TRUE,
    creado_en      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendedor_id) REFERENCES usuarios (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Metodos de pago guardados
CREATE TABLE metodos_pago
(
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id   BIGINT UNSIGNED NOT NULL,
    tipo_metodo  VARCHAR(100) NOT NULL,
    proveedor    VARCHAR(100) NULL,
    token        VARCHAR(500) NULL,
    detalles     JSON NULL,
    es_principal BOOLEAN               DEFAULT FALSE,
    creado_en    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Carteras / wallets
CREATE TABLE carteras
(
    id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id       BIGINT UNSIGNED NOT NULL,
    moneda           VARCHAR(10)    NOT NULL DEFAULT 'USD',
    saldo_disponible DECIMAL(18, 4) NOT NULL DEFAULT 0.0000,
    saldo_pendiente  DECIMAL(18, 4) NOT NULL DEFAULT 0.0000,
    creado_en        TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE transacciones_cartera
(
    id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cartera_id BIGINT UNSIGNED NOT NULL,
    monto      DECIMAL(18, 4) NOT NULL,
    moneda     VARCHAR(10)    NOT NULL,
    tipo_txn   ENUM('credito','debito') NOT NULL,
    referencia VARCHAR(255) NULL,
    metadatos  JSON NULL,
    creado_en  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cartera_id) REFERENCES carteras (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Metricias del vendedor (snapshot diario)
CREATE TABLE metricas_vendedor
(
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vendedor_id         BIGINT UNSIGNED NOT NULL,
    fecha_metrica       DATE      NOT NULL,
    conteo_ventas       INT       NOT NULL DEFAULT 0,
    cancelaciones       INT       NOT NULL DEFAULT 0,
    tasa_envio_a_tiempo DECIMAL(5, 2) NULL,
    calificacion_media  DECIMAL(3, 2) NULL,
    crudo               JSON NULL,
    creado_en           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY (vendedor_id, fecha_metrica),
    FOREIGN KEY (vendedor_id) REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Registros de auditoria / actividad
CREATE TABLE registros_auditoria
(
    id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_actor_id BIGINT UNSIGNED NULL,
    accion           VARCHAR(255) NOT NULL,
    tipo_objeto      VARCHAR(100) NULL,
    id_objeto        VARCHAR(255) NULL,
    detalles         JSON NULL,
    ip               VARCHAR(100) NULL,
    user_agent       VARCHAR(1000) NULL,
    creado_en        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_actor_id) REFERENCES usuarios (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Indices para busquedas rapidas (ejemplos)
CREATE INDEX idx_publicaciones_vendedor ON publicaciones (vendedor_id);
CREATE INDEX idx_publicaciones_precio ON publicaciones (precio);
CREATE INDEX idx_productos_categoria ON productos (categoria_id);
CREATE INDEX idx_pedidos_comprador ON pedidos (comprador_id);
CREATE INDEX idx_pedidos_vendedor ON pedidos (vendedor_id);
CREATE INDEX idx_pagos_pedido ON pagos (pedido_id);
CREATE INDEX idx_envios_pedido ON envios (pedido_id);

SET
FOREIGN_KEY_CHECKS = 1;