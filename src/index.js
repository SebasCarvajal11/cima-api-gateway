const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();

// 1. Configuración de CORS
app.use(cors({
    origin:['http://localhost:5173', 'http://localhost:3000'],
    methods:['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'accesstoken', 'Authorization']
}));

// Endpoint de prueba
app.get('/', (req, res) => {
    res.json({ message: '🚀 CIMA API Gateway Unificado funcionando' });
});

// 2. REGLAS DE ENRUTAMIENTO

// Todo lo que vaya a /api/v1/core -> Se va a la Fase 1
app.use('/api/v1/core', createProxyMiddleware({ 
    target: process.env.URL_FASE1, 
    changeOrigin: true,
    pathRewrite: { '^/api/v1/core': '' } 
}));

// Todo lo que vaya a /api/v1/collab -> Se va a su microservicio (Fase 2)
app.use('/api/v1/collab', createProxyMiddleware({ 
    target: process.env.URL_FASE2, 
    changeOrigin: true 
}));

// Todo lo que vaya a /api/v1/marketing -> Se va al microservicio de Java (Fase 3 y 4)
app.use('/api/v1/marketing', createProxyMiddleware({ 
    target: process.env.URL_FASE3, 
    changeOrigin: true 
}));

// 3. Levantar el servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`API Gateway corriendo en el puerto ${PORT}`);
});