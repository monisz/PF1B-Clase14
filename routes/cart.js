const express = require('express');

const router = express.Router();

const Container = require('../container');
const fileCart = new Container ("carrito.txt");
const fileProduct = new Container ("productos.txt");


//Para agregar un carrito
router.post('/', (req, res) => {
    const newCart = {
        timestamp : Date.now(),
        products: []
    };
    console.log(newCart);
    const getCart = (async () => {
        const newId = await fileCart.save(newCart);
        res.send(`carrito agregado id: ${newId}`);
    }) ();
});

//Para borrar un carrito según su id
router.delete('/:id', (req, res) => {
    const deleteCart = (async () => {
        const id = parseInt(req.params.id);
        const result = await fileCart.deleteById(id);
        if (!result) res.status(404).send({error: "carrito no encontrado"});
        else res.send("carrito eliminado");
    }) ();
});

//Para listar todos los productos de un carrito según su id
router.get('/:id/productos', (req, res) => {
    const getCart = (async () => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).send({error: "el parámetro no es un número"});
        const cart = await fileCart.getById(id);
        if (!cart) res.status(404).send({error: "carrito no encontrado"});
        else {
            const products = cart.products;
            res.json({products});
        }
    }) ();
});


//Para agregar un producto al carrito por su id
//el id del producto llega por el body
router.post('/:id/productos', (req, res) => {
    const idCart = parseInt(req.params.id);
    const idProduct = req.body.id;
    const getProduct = (async () => {
        if (isNaN(idProduct)) return res.status(400).send({error: "el parámetro no es un número"});
        const productToAdd = await fileProduct.getById(idProduct);
        if (!productToAdd) res.status(404).send({error: "producto no encontrado"});
        else {
            const getCart = (async () => {
                const cart = await fileCart.getById(idCart);
                if (!cart) res.send('error: no existe ese carrito');
                else {
                    cart.products.push(productToAdd);
                    const updateCart = (async () => {
                        const CartModified = await fileCart.replaceById(idCart, cart);
                        res.send(`producto id: ${idProduct} agregado en carrito id: ${idCart}`);
                    }) ();
                }
            }) ();
        }
    }) ();
});


//Elimina del carrito id el producto id_prod
router.delete('/:id/productos/:id_prod', (req, res) => {
    const idCart = parseInt(req.params.id);
    const idProduct = parseInt(req.params.id_prod);
    if ( isNaN(idCart) || isNaN(idProduct) ) return res.status(400).send({error: "algún parámetro no es un número"});
    else {
        const getCart = (async () => {
            const cart = await fileCart.getById(idCart)
            if (!cart) res.send('error: no existe ese carrito');
            else {
                const productFind = cart.products.find((elem) => elem.id === idProduct);
                if (!productFind) res.send('error: no existe ese producto en el carrito');
                else {
                    cart.products = cart.products.filter((elem) => elem.id !== idProduct);
                    const updateCart = (async () => {
                        const CartModified = await fileCart.replaceById(idCart, cart);
                        res.send(`producto id: ${idProduct} eliminado del carrito id: ${idCart}`);
                    }) ();
                }
            }
        }) ();
    }
});


module.exports = router;