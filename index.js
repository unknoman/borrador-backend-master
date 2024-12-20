
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

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
});

// Rutas
const viewsRouter = require('./routers/views.router');
app.use('/', viewsRouter);

// Iniciar el servidor
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:8080`);
});
