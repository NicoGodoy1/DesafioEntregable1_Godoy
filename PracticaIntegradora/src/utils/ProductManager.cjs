const fs = require('fs');


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
            console.error(`-Product ID: ${id} not found`)
            return
        }
        console.log(`-Product ID: ${id} found`)
        return product;
    }

    deleteById = async (id) => {
        const data = await this.read()
        const deleteProduct = data.findIndex(o => o.id == id)
        const deleted = data.splice(deleteProduct, 1)
        await this.write(data)
        return deleted;
    }
    
    getProducts = async () => {
        const data = await this.read()
        return data
    }

    addProduct = async (product) => {
        const camposObligatorios = ['title', 'description', 'price', 'thumbnail', 'code', 'stock', 'category'];
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
            thumbnail: product.thumbnail,
            code: product.code,
            stock: product.stock,
            category: product.category,
            stock: product.stock,
            status: true, 
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

    deleteProduct = async (id) => {
        const products = await this.getProducts()
        const productId = products.some(prod => prod.id === +id )

        if(productId) {
            const newProductList = products.filter(prod => prod.id !== +id)
            await fs.promises.writeFile(this.path, JSON.stringify(newProductList), 'utf-8');
            return true;
        } else {
            console.log(`ID ${id} does not exist`);
            return false;
        }
     }
};

module.exports = ProductManager;