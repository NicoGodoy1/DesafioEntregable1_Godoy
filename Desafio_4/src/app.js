// import express from 'express';
// import ProductManager from './ProductManager.msj';

const express = require('express');
const fs = require('fs');

const PORT = 8080;
const app = express();
app.use(express.urlencoded({extended: true}));

class ProductManager {
  
    constructor(path) {
        this.path = path
    }

    read = () => {
        if(fs.existsSync(this.path)){
            return fs.promises.readFile(this.path, "utf-8").then(r => JSON.parse(r))  
        }
        return []
    }

    write = list => {
        return fs.promises.writeFile(this.path, JSON.stringify(list), 'utf-8')
    }

    generateProductId = list => {
        const count = list.length
        return (count > 0) ? list[count-1].id + 1 : 1
    }

    getProductById = async (id) => {
        const products = await this.read()
        const product = products.find(p => p.id === id );
        if(!product){
            console.error(`-Product id: ${id} not found`)
            return
        }
        console.log(`-Product id: ${id} found`)
        return product;
    }

    deleteById = async (id) => {
        const data = await this.read()
        const deleteProduct = data.findIndex(o => o.id == id)
        const deleted = data.splice(deleteProduct, 1)
        await this.write(data)
        return deleted;
    }
    
    getProducts = async (limit) => {
        const data = await this.read()
        return limit ? data.slice(0, limit) : data
        
    }

    addProduct = async (product) => {
        const camposObligatorios = ['title', 'description', 'price', 'code', 'stock'];
            for (const campo of camposObligatorios) {
            if (!product[campo]) {
                return console.log(`-Debe completar el campo: ${campo} para poder agregar el producto`);
            }         
        }

        const list = await this.read()

        const productoExistente = list.find(productoExistente => productoExistente.code === product.code);
        if (productoExistente) {
            console.log('-El código del producto ya existe, intentá con un código diferente')
            return 
        }
        
        const newProduct = {
            id: this.generateProductId(list),
            title: product.title,
            description: product.description,
            price: product.price,
            thumbnail: product.thumbnail || 'Sin imagen',
            code: product.code,
            stock: product.stock,
        };

        list.push(newProduct)
        await this.write(list)
        return newProduct
    }

    updateProduct = async (id, productToUpdate) => {
        const products = await this.read();
        const updatedProducts = products.map(product => {
            if(product.id === id){
                return {
                    ...product,
                    ...productToUpdate,
                    id
                }
            }
            return product;
        });
        await this.write(updatedProducts)
    }
}

const productManager = new ProductManager('productos.json')

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Error interno del servidor')
})

app.get('/', (req, res) => {
  res.send('<h1 style="color: red">¡Bienvenido al servidor!<h1>')
})

app.get('/products', async (req, res, next) => {
  try {
    const limit = req.query.limit
    const products = await productManager.getProducts(limit)
    res.json(products)
  } catch (error) {
    next(error)
  }
})

app.get('/products/:pid', async (req, res, next) => {
  try {
    const productId = parseInt(req.params.pid)
    const product = await productManager.getProductById(productId)
    if (product) {
        res.json(product)
    } else {
        res.status(404).json({ error: 'El producto no existe' });
    }
  } catch (error) {
    next(error)
  }
})

app.listen(PORT, async () => {
  console.log(`Servidor funcionando desde el puerto http://localhost:${PORT}`)
})
