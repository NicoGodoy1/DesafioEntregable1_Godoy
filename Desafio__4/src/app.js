const express = require('express');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');

const productsRouter = require('./routes/products.routes.cjs')
const cartsRouter = require('./routes/carts.routes.cjs')
const viewsRouter = require("./routes/views.routes.cjs")


const ProductManager = require("./utils/ProductManager.cjs")
const productManager = new ProductManager("src/data/products.json");


const app = express();
const fs = require('fs');
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

app.engine('handlebars', handlebars.engine());
app.set('views', 'src/views');
app.set('view engine', 'handlebars');


app.use("/", viewsRouter);
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)




app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Error interno del servidor')
})


const httpServer = app.listen(PORT, () => {
  console.log(`Servidor funcionando desde el puerto http://localhost:${PORT}`)
});


const io = new Server(httpServer);

io.on("connect", socket => {
    console.log("Cliente conectado");
    sendProducts(socket);
});

const sendProducts = async (io) => {
    try {
        const products = await productManager.getProducts();
        io.emit("products", products);
    } catch (error) {
        console.log(error.message);
    }
};
