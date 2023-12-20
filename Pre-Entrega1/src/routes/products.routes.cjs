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
});

productsRouter.delete('/:pId', async (req, res)=> {
  const {pId} = req.params;
  const productDeleted = await productManager.deleteProduct(pId);
  if(!productDeleted){
    return res.status(404).send({message: 'product not found'});
  }
  res.send({message: 'product deleted'});
});

productsRouter.post("/", async (req, res) => {
  const newProduct = req.body;
  try {
      const addProduct = await productManager.addProduct(newProduct);
      res.send({message: "Product added"});
  } catch (error) {
      res.send({message: "Error adding product"});
      console.log(error);
  }
});

productsRouter.put("/:pId", async (req, res) => {
  try {
      const { pId } = req.params;
      const updateProduct = req.body;
      const products = await productManager.updateProduct(updateProduct, pId);
      res.send({message: "Product updated"});
  } catch (error) {
      console.error(error);
      res.status(404).send({message:"Product not found"});
  }
});

module.exports = productsRouter;