const fs = require('fs')


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
            console.error(`-Product id: ${id} Not Found`)
            return
        }
        console.log(`-Producto id: ${id} encontrado`)
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


const test = async () => {

    // Se creará una instancia de la clase "ProductManager"
    const productManager = new ProductManager('productos.json');

    // Se llamará a "getProducts" en la instancia recién creada, debe devolver un arreglo vacío []
    let arregloVacio = await productManager.getProducts();
    console.log(arregloVacio);

    // Se llamará al método “addProduct” con los campos: title: “producto prueba”, description:”Este es un producto prueba”, price:200, thumbnail:”Sin imagen”, code:”abc123”, stock:25
    const newProduct1 = {
        title: 'producto prueba',
        description: 'Este es un producto prueba',
        price: 200,
        thumbnail: 'Sin imagen',
        code: 'abc123',
        stock: 25,
    };
    await productManager.addProduct(newProduct1);

    // Se llamará al método “addProduct” con los mismos campos de arriba, debe arrojar un error porque el código estará repetido

    const newProduct2 = {
        title: 'producto prueba 2 - CODIGO REPETIDO',
        description: 'Este es un producto prueba 2',
        price: 200,
        thumbnail: 'Sin imagen',
        code: 'abc123',
        stock: 35,
    };
    const newProduct3 = {
        title: 'producto prueba 3 - SERÁ BORRADO',
        description: 'Este es un producto prueba 3',
        price: 200,
        thumbnail: 'Sin imagen',
        code: 'abc3333',
        stock: 35,
    };

    const newProduct4 = {
        title: 'producto prueba 4 - SERÁ MODIFICADO',
        description: 'Este es un producto prueba 4',
        price: 200,
        thumbnail: 'Sin imagen',
        code: 'abc4444',
        stock: 35,
    };

    const newProduct5 = {
        title: 'producto prueba 5',
        description: 'Este es un producto prueba 5',
        price: 200,
        thumbnail: 'Sin imagen',
        code: 'abc555',
        stock: 35,
    };

    await productManager.addProduct(newProduct2);
    await productManager.addProduct(newProduct3);
    await productManager.addProduct(newProduct4);
    await productManager.addProduct(newProduct5);

    // Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
    data = await productManager.getProducts();
    console.log(data);


    // Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no se elimine el id y que sí se haya hecho la actualización.
     await productManager.updateProduct(3, {
        title: 'TITULO MODIFICADO',
        description: 'DESCRIPCION MODIFICADA'
     });


    // Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.
    await productManager.deleteById(2);

    //Se evaluará que getProductById devuelva error si no encuentra el producto o el producto en caso de encontrarlo


    const encontrado1 = await productManager.getProductById(2);  
    const encontrado2 = await productManager.getProductById(15);
    
}

test();


