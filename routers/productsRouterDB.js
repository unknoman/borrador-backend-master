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
  
  
// Ruta GET / - Listar todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products); // Devuelve los productos desde la base de datos
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productosDB' });
  }
});

// Ruta GET /:pid - Obtener producto por ID
router.get('/:pid', async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await Product.findById(pid);
    if (product) {
      res.json(product); // Devuelve el producto encontrado
    } else {
      res.status(404).json({ error: 'Producto no encontradoDB' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar el productoDB' });
  }
});

// Ruta POST / - Agregar nuevo producto
router.post('/', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save(); // Guarda el nuevo producto en la base de datos
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ error: 'Error al agregar productoDB' });
  }
});

// Ruta PUT /:pid - Actualizar producto
router.put('/:pid', async (req, res) => {
  const { pid } = req.params;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, { new: true });
    if (updatedProduct) {
      res.json(updatedProduct); // Devuelve el producto actualizado
    } else {
      res.status(404).json({ error: 'Producto no encontradoDB' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar productoDB' });
  }
});

// Ruta DELETE /:pid - Eliminar producto
router.delete('/:pid', async (req, res) => {
  const { pid } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(pid);
    if (deletedProduct) {
      res.status(204).send(); // El producto ha sido eliminado correctamente
    } else {
      res.status(404).json({ error: 'Producto no encontradoDB' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar productoDB' });
  }
});

module.exports = router;
module.exports = { readProductDB };