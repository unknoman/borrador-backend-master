const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const filePath = path.join(__dirname, '../data/products.json');

// Función para leer productos desde el archivo JSON
const readProducts = () => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

// Ruta para la vista de productos en tiempo real
router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

// Ruta para mostrar productos en formato JSON
router.get('/products', (req, res) => {
    const products = readProducts();
    res.render('home', { products });
});

module.exports = router;