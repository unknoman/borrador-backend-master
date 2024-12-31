const express = require('express');
const Product = require('../models/Product'); // Importa el modelo de producto

const router = express.Router();
//---
const readProductDB = async () => {
    try {
      const products = await Product.find();
      return products;
    } catch (err) {
      throw new Error('Error al obtener productosDB');
    }
  };
  
  

module.exports = router;
module.exports = { readProductDB };