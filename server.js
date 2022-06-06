const express = require('express');
const { engine } = require('express-handlebars');
const { Server: HttpServer } = require('http');
const { Server: SocketServer } = require('socket.io');
const fs = require('fs');

/* const messages = []; */
/* const fileMessages = "mensajes.txt"; */
/* fs.writeFileSync(fileMessages, "[]"); */

const app = express();
const routerProducts = express.Router();
const routerCart = express.Router();

const httpServer = new HttpServer(app);
const ioServer = new SocketServer(httpServer);

const Container = require('./container');
const fileName = new Container ("productos.txt");

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine(
    'hbs',
    engine({
      extname: '.hbs',
      defaultLayout: 'index.hbs',
    })
);

app.set('views', './public/views');
app.set('view engine', 'hbs');

//Vista de todos los productos
/* routerProducts.get('/', (req, res) => { */
/*     const entry = JSON.stringify(req.params) */
/*     const getProducts = (async () => { */
/*         const products = await fileName.getAll(); */
/*         res.render('main', {products}); */
/*     }) (); */
/* }); */


//Para obtener un producto según su id
routerProducts.get('/:id', (req, res) => {
    const getProduct = (async () => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).send({error: "el parámetro no es un número"});
        const product = await fileName.getById(id);
        if (!product) res.status(404).send({error: "producto no encontrado"});
        else {
            const products = [product];
            res.render('main', {products});
        }
    }) ();
});

//Para agregar un producto
routerProducts.post('/', (req, res) => {
    const newProduct = req.body;
    newProduct.timestamp = Date.now();
    console.log(newProduct);
    const getProducts = (async () => {
        const newId = await fileName.save(newProduct);
    }) ();
    res.redirect('/api/productos');
});


//Recibe y actualiza un producto por id,
//como no pedía ninguna devolución, decidí que devuelva el producto completo
routerProducts.put('/:id', (req, res) => {
    const updateProduct = (async () => {
        const id = parseInt(req.params.id);
        const newProduct = await fileName.replaceById(id, req.body);
            console.log(newProduct);
            if (!newProduct) res.status(404).send({error: "producto no encontrado"});
        }) ();
});

//Para borrar un producto según el id
routerProducts.delete('/:id', (req, res) => {
    const deleteProduct = (async () => {
        const id = parseInt(req.params.id);
        const result = await fileName.deleteById(id);
        if (!result) res.status(404).send({error: "producto no encontrado"});
        else res.send("producto eliminado");
    }) ();
})



//Para guardar el nuevo mensaje en el archivo de mensajes
/* const saveMessage = (message) => { */
/*     const content = fs.readFileSync(fileMessages, 'utf-8'); */
/*     const contentParse = JSON.parse(content); */
/*     contentParse.push(message); */
/*     fs.writeFileSync(fileMessages, JSON.stringify(contentParse, null, 2)); */
/* } */


//Si piden una ruta que no esté definida
//Solo localhost:8080
app.get('/', (req, res) => {
    const entry = JSON.stringify(req.params)
    res.status(404).send({
        error: 404,
        descripcion: `ruta ${entry} método GET no implementada`});
})

//para cualquier cosa escrita luego de la barra
app.get('/:entry', (req, res) => {
    res.status(404).send({
        error: 404,
        descripcion: `ruta ${req.params.entry} método GET no implementada`});
})

//Para lo que se escribe luego de api/
app.get('/api/:entry', (req, res) => {
    if ( req.params.entry !== "productos") {
        res.status(404).send({
            error: 404,
            descripcion: `ruta /api/${req.params.entry} método GET no implementada`});
    } else {
        const entry = JSON.stringify(req.params)
        const getProducts = (async () => {
            const products = await fileName.getAll();
            res.render('main', {products});
        }) ();
    };
});


app.use('/api/productos', routerProducts);
app.use('/api/carrito', routerCart);

httpServer.listen(8080, () => {
    console.log("escuchando desafio 14");
});


ioServer.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    /* socket.emit('messages', messages); */

    /* socket.on("newMessage", (message) => { */
    /*     messages.push(message); */
    /*     ioServer.sockets.emit("messages", messages); */
    /*     saveMessage(message); */
    /* })     */
})
