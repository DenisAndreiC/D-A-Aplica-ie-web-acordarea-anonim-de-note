#!/bin/bash

# Funcție pentru a opri procesele când se închide scriptul
cleanup() {
    echo ""
    echo "🛑 Se opresc serverele..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit
}

# Capturăm comanda de ieșire (Ctrl+C)
trap cleanup SIGINT

echo "🚀 Se inițializează aplicația..."

# 1. Configurare și Pornire Backend
echo "📦 Verificare Backend..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "   Installing backend dependencies..."
    npm install --silent
fi
# Pornim backend-ul în background (&)
node index.js &
BACKEND_PID=$!
echo "✅ Backend pornit (Port 3000)"

# 2. Configurare și Pornire Frontend
echo "📦 Verificare Frontend..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    echo "   Installing frontend dependencies..."
    npm install --silent
fi
# Pornim frontend-ul în background (&)
npm run dev &
FRONTEND_PID=$!
echo "✅ Frontend pornit (Port 5173)"

echo ""
echo "🎉 Aplicația rulează!"
echo "👉 Deschide: http://localhost:5173"
echo " (Apasă Ctrl+C pentru a opri totul)"

# Așteptăm să ruleze procesele
wait
