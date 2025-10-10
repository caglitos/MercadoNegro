#!/usr/bin/env bash

# =============================
# Script para reestructurar el backend a formato modular
# =============================

set -e  # Detiene si hay error

BASE_DIR="./src"
MODULES_DIR="$BASE_DIR/modules"

# Crear carpeta base de módulos
mkdir -p "$MODULES_DIR"

# Recorremos todos los archivos de "controller"
for controller in "$BASE_DIR"/controller/*.controller.js; do
    # Obtener el nombre base sin extensión
    filename=$(basename "$controller")
    module_name=${filename%%.controller.js}

    echo "Procesando módulo: $module_name"

    # Crear la carpeta del módulo
    mkdir -p "$MODULES_DIR/$module_name"

    # Mover archivos si existen
    model="$BASE_DIR/model/$module_name.model.js"
    routes="$BASE_DIR/route/$module_name.routes.js"
    schema="$BASE_DIR/schema/$module_name.schemas.js"

    # Mueve el controller
    mv "$controller" "$MODULES_DIR/$module_name/$filename"

    # Mueve los demás si existen
    [ -f "$model" ] && mv "$model" "$MODULES_DIR/$module_name/$(basename "$model")"
    [ -f "$routes" ] && mv "$routes" "$MODULES_DIR/$module_name/$(basename "$routes")"
    [ -f "$schema" ] && mv "$schema" "$MODULES_DIR/$module_name/$(basename "$schema")"
done

# Elimina carpetas vacías
rmdir "$BASE_DIR/controller" "$BASE_DIR/model" "$BASE_DIR/route" "$BASE_DIR/schema" 2>/dev/null || true

echo "✅ Reestructuración completa."
echo "Revisa ahora: $MODULES_DIR"
