const express = require('express');
const { engine } = require('express-handlebars');
const { Server: HttpServer } = require('http');
const { Server: SocketServer } = require('socket.io');

const apiRoutes = require('./routes');
const app = express();

const httpServer = new HttpServer(app);
const ioServer = new SocketServer(httpServer);

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
    
app.use('/', apiRoutes);
    
httpServer.listen(8080, () => {
    console.log("escuchando desafio 14");
});
    
ioServer.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
});