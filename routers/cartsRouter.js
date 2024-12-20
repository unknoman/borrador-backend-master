const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const filePath = path.join(__dirname, '../data/carts.json');

const readCarts = () => JSON.parse(fs.readFileSync(filePath, 'utf-8'));
const writeCarts = (data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

// Ruta POST / - Crear nuevo carrito..
router.post('/', (req, res) => {
  const carts = readCarts();
  const newCart = { id: carts.length ? carts[carts.length - 1].id + 1 : 1, products: [] };
  carts.push(newCart);
  writeCarts(carts);
  res.status(201).json(newCart);
});

// Ruta GET /:cid - Listar productos en un carrito..
router.get('/:cid', (req, res) => {
  const { cid } = req.params;
  const carts = readCarts();
  const cart = carts.find(c => c.id == cid);
  cart ? res.json(cart.products) : res.status(404).json({ error: 'Carrito no encontrado' });
});

// Ruta POST /:cid/product/:pid - Agregar producto al carrito..
router.post('/:cid/product/:pid', (req, res) => {
  const { cid, pid } = req.params;
  let carts = readCarts();
  const cartIndex = carts.findIndex(c => c.id == cid);

  if (cartIndex === -1) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  const productIndex = carts[cartIndex].products.findIndex(p => p.product == pid);

  if (productIndex === -1) {
    carts[cartIndex].products.push({ product: pid, quantity: 1 });
  } else {
    carts[cartIndex].products[productIndex].quantity += 1;
  }

  writeCarts(carts);
  res.json(carts[cartIndex]);
});

module.exports = router;
