
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
//--- models

const Product = require('./models/Product'); // Asegúrate de que la ruta sea correcta
// Configuración del motor de plantillas Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Ruta al archivo de productos JSON
const filePath = path.join(__dirname, 'data/products.json');

// Función para leer productos desde el archivo JSON
const readProducts = () => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

// Función para escribir productos en el archivo JSON
const writeProducts = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Cargar productos iniciales
let products = readProducts();

// Configuración de WebSocket
io.on('connection', (socket) => {
    console.log('Usuario conectado');

    // Enviar productos actuales al nuevo cliente
    socket.emit('updateProducts', products);

    // Escuchar eventos para agregar un producto
    socket.on('addProduct', (product) => {
        product.id = products.length ? products[products.length - 1].id + 1 : 1; // Generar un ID único
        products.push(product);
        writeProducts(products); // Actualizar el archivo JSON
        io.emit('updateProducts', products);
    });

    // Escuchar eventos para eliminar un producto
    socket.on('deleteProduct', (productId) => {
        products = products.filter(p => p.id !== productId);
        writeProducts(products); // Actualizar el archivo JSON
        io.emit('updateProducts', products);
    });

    //db

    socket.on('getProductsDB', async () => {
        try {
            const products = await Product.find();
            socket.emit('updateProductsDB', products); // Enviar lista de productos al cliente
        } catch (err) {
            socket.emit('error', 'Error al obtener productosDB');
        }
    });

    socket.on('addProductDB', async (product) => {
        try {
            const lastProduct = await Product.findOne().sort({ id: -1 });
            const nextId = lastProduct ? lastProduct.id + 1 : 1;

            product.id = nextId;

            const newProduct = new Product(product);
    
            console.log("producto agregado: " + newProduct.title);
            const savedProduct = await newProduct.save();
            console.log(savedProduct);
    
            io.emit('updateProductsDB', await Product.find());
    
        } catch (err) {
            socket.emit('error', 'Error al agregar productoDB');
        }
    });
    

    // Actualizar producto
    socket.on('updateProductDB', async (product) => {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(product._id, product, { new: true });
            if (updatedProduct) {
                io.emit('updateProductsDB', await Product.find()); // Emitir productos actualizados
            } else {
                socket.emit('error', 'Producto no encontradoDB');
            }
        } catch (err) {
            socket.emit('error', 'Error al actualizar productoDB');
        }
    });

    // Eliminar producto
    socket.on('deleteProductDB', async (productId) => {
        try {
            const deletedProduct = await Product.findByIdAndDelete(productId);
            if (deletedProduct) {
                io.emit('updateProductsDB', await Product.find()); // Emitir productos actualizados
            } else {
                socket.emit('error', 'Producto no encontradoDB');
            }
        } catch (err) {
            socket.emit('error', 'Error al eliminar productoDB');
        }
    });
});


// Rutas
const viewsRouter = require('./routers/views.router');
app.use('/', viewsRouter);




//---


const mongoose = require('mongoose');

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/miBaseDeDatos')
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.log("Error de conexión:", err));



// Iniciar el servidor
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:8080`);
});
