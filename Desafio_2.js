const fs = require('fs')


class ProductManager {
    constructor(path) {
        this.path = path;
    }

    generateProductId() {
        const count = this.products.length
        return (count > 0) ? this.products[count-1].id + 1 : 1
      }

    getProducts() {
      return this.products;
    }
  
    async addProduct(product) {

        const camposObligatorios = ['title', 'description', 'price', 'code', 'stock'];
        for (const campo of camposObligatorios) {
          if (!product[campo]) {
            console.log(`-Debe completar el campo: ${campo} para poder agregar el producto`);
            return
          }
          
        }

        // const productoExistente = this.products.find(productoExistente => productoExistente.code === product.code);
        // if (productoExistente) {
        //   return '-El código del producto ya existe, intentá con un código diferente';
        // }
    
        // const newProduct = {
        //   id: this.generateProductId(),
        //   title: product.title,
        //   description: product.description,
        //   price: product.price,
        //   thumbnail: product.thumbnail || 'Sin imagen',
        //   code: product.code,
        //   stock: product.stock,
        // };

        const products = await this.buscarProducto();

        products.push(product);
    
        await fs.promises.writeFile(this.path, JSON.stringify(products), 'utf-8');
        return product;
      }
  
    getProductById(productId) {
      const product = this.products.find(product => product.id === productId);
      if (!product) {
        return '-Product Not found';
      }
      console.log('-El producto encontrado es:')
      return product
    }

    async buscarProducto() {
        try {
            const datos = await fs.promises.readFile(this.path, "utf-8");
            const parsedData = JSON.parse(datos);
            return parsedData;
          } catch (error) {
            console.log("No hay datos");
            return [];
          }
    }
  }
  
