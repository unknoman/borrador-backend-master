const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const filePath = path.join(__dirname, '../data/products.json');

// Helper para leer y escribir en el archivo de productos..
const readProducts = () => JSON.parse(fs.readFileSync(filePath, 'utf-8'));
const writeProducts = (data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

// Ruta GET / - Listar todos los productos..
router.get('/', (req, res) => {
  const products = readProducts();
  res.json(products);
});

// Ruta GET /:pid - Obtener producto por ID..
router.get('/:pid', (req, res) => {
  const { pid } = req.params;
  const products = readProducts();
  const product = products.find(p => p.id == pid);
  product ? res.json(product) : res.status(404).json({ error: 'Producto no encontrado' });
});

// Ruta POST / - Agregar nuevo producto..
router.post('/', (req, res) => {
  const newProduct = req.body;
  const products = readProducts();
  newProduct.id = products.length ? products[products.length - 1].id + 1 : 1;
  products.push(newProduct);
  writeProducts(products);
  res.status(201).json(newProduct);
});

// Ruta PUT /:pid - Actualizar producto..
router.put('/:pid', (req, res) => {
  const { pid } = req.params;
  const updatedData = req.body;
  let products = readProducts();
  const productIndex = products.findIndex(p => p.id == pid);

  if (productIndex === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  products[productIndex] = { ...products[productIndex], ...updatedData, id: products[productIndex].id };
  writeProducts(products);
  res.json(products[productIndex]);
});

// Ruta DELETE /:pid - Eliminar producto..
router.delete('/:pid', (req, res) => {
  const { pid } = req.params;
  let products = readProducts();
  const newProducts = products.filter(p => p.id != pid);

  if (products.length === newProducts.length) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  writeProducts(newProducts);
  res.status(204).send();
});

module.exports = router;


