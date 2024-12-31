const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: { type: Number, required: false, unique: true},  // Si quieres un ID numérico
    title: { type: String, required: true },
    price: { type: Number, required: true },
});

// Se crea el modelo basado en el esquema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
