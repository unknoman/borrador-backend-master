const express = require('express');
const path = require('path');
const fs = require('fs');
const  readProductDB = require('./productsRouterDB');

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





// Ruta para la vista de productos en tiempo real
router.get('/realtimeproductsDB', async (req, res) => {
    try {
      // Llama a la función que obtiene los productos desde la base de datos
      const  productsDB  = await readProductDB.readProductDB();
      console.log("xd" + productsDB);
      
      // Renderiza la vista pasando los productos
      res.render('realTimeProductsDB', { productsDB });
    } catch (err) {
      console.error('Error al obtener productos:', err);
      res.status(500).send('Error al obtener productos'+ err);
    }
  });


module.exports = router;