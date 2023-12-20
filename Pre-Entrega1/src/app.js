const express = require('express')

const productsRouter = require('./routes/products.routes.cjs')
const cartsRouter = require('./routes/carts.routes.cjs')

const app = express();
const fs = require('fs');


const PORT = 8080;
app.use(express.urlencoded({extended: true}));


app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)


app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Error interno del servidor')
})

app.get('/', (req, res) => {
  res.send('<h1 style="color: red">¡Bienvenido al servidor!<h1>')
})

app.listen(PORT, async () => {
  console.log(`Servidor funcionando desde el puerto http://localhost:${PORT}`)
})
