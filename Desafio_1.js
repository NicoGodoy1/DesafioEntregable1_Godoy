class ProductManager {
    constructor() {
      this.products = [];
    }

    generateProductId() {
        const count = this.products.length
        return (count > 0) ? this.products[count-1].id + 1 : 1
      }

    getProducts() {
      return this.products;
    }
  
    addProduct(product) {

        const camposObligatorios = ['title', 'description', 'price', 'code', 'stock'];
        for (const campo of camposObligatorios) {
          if (!product[campo]) {
            console.log(`-Debe completar el campo: ${campo} para poder agregar el producto`);
            return
          }
        }
    
        
        const productoExistente = this.products.find(productoExistente => productoExistente.code === product.code);
        if (productoExistente) {
          return '-El código del producto ya existe, intentá con un código diferente';
        }
    
        const newProduct = {
          id: this.generateProductId(),
          title: product.title,
          description: product.description,
          price: product.price,
          thumbnail: product.thumbnail || 'Sin imagen',
          code: product.code,
          stock: product.stock,
        };
    
        this.products.push(newProduct);
        return newProduct;
      }
  
    getProductById(productId) {
      const product = this.products.find(product => product.id === productId);
      if (!product) {
        return '-Product Not found';
      }
      console.log('-El producto encontrado es:')
      return product
    }
  }
  


// Se creará una instancia de la clase "ProductManager"
const productManager = new ProductManager();
  

// Se llamará a "getProducts" en la instancia recién creada, debe devolver un arreglo vacío []
console.log(productManager.getProducts());


// Se llamará al método “addProduct” con los campos: title: “producto prueba”, description:”Este es un producto prueba”, price:200, thumbnail:”Sin imagen”, code:”abc123”, stock:25
const newProduct = {
    title: 'producto prueba',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc123',
    stock: 25,
};

productManager.addProduct(newProduct);

// Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
console.log(productManager.getProducts());

  
// Se llamará al método “addProduct” con los mismos campos de arriba, debe arrojar un error porque el código estará repetido
console.log(productManager.addProduct(newProduct));
 

//Se evaluará que getProductById devuelva error si no encuentra el producto o el producto en caso de encontrarlo
console.log(productManager.getProductById(1));
console.log(productManager.getProductById(15));