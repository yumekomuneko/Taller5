#!/bin/bash
set -o errexit

echo "🚀 Iniciando build..."
npm install
npm run build
echo "✅ Build completado"