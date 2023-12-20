const { Router } = require('express');

const ProductManager = require('../ProductManager.cjs')
const productManager = new ProductManager("./src/Products.json")


const productsRouter = Router();


productsRouter.get('/', async (req, res, next) => {
    try {
      const limit = req.query.limit
      const products = await productManager.getProducts(limit)
      res.json(products)
    } catch (error) {
      next(error)
    }
  })
  
productsRouter.get('/:pid', async (req, res, next) => {
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

productsRouter.delete('/:pId', async (req, res)=> {
  const {pId} = req.params;
  const productDeleted = await productManager.deleteProduct(pId);
  if(!productDeleted){
    return res.status(404).send({message: 'product not found'});
  }
  res.send({message: 'product deleted'});
})

module.exports = productsRouter;