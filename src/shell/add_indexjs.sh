#!/usr/bin/env bash

# =============================
# Script para crear index.js vacío en cada módulo
# =============================

MODULES_DIR="./src/modules"

for module in "$MODULES_DIR"/*; do
    if [ -d "$module" ]; then
        index_file="$module/index.js"
        if [ ! -f "$index_file" ]; then
            echo "// index.js del módulo $module" > "$index_file"
            echo "Creando $index_file"
        else
            echo "$index_file ya existe, se omite"
        fi
    fi
done

echo "Todos los index.js creados o verificados."
