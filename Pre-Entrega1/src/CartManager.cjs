const fs = require('fs');


class CartManager {

    constructor(path) {
        this.path = path
    }

    async getCarts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const carts = JSON.parse(data);
            return carts;
        } catch(error) {
            console.error(error);
            return[];
        }
    }

    async getCartById(cartId) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(c => c.id === +cartId);
            if(!cart){
                return false
            }
            return cart;
        } catch(error){
            console.error(error)
            return(false)
        }
        
    }

    async addCart() {
        try {
            const carts = await this.getCarts();
            carts.push({
                id : carts.length + 1,
                products: []
            })
            await fs.promises.writeFile(this.path, JSON.stringify(carts), 'utf-8');
            return true;
        } catch(error){
            console.error(error);
            return false;
        }
       
    }

    async addProductToCart(pId, cId){
        try{
            const carts = await this.getCarts();
            const updatedCarts = carts.map ( cart => {
                if(cart.id === +cId){
                    const existingProduct = cart.products.find(p => p.id === +pId);
                    if(existingProduct){
                        existingProduct.quantity++;
                    }
                    else {
                        cart.products = [...cart.products, {id: +pId, quantity: 1}];
                    }
                }
                return cart;
            });
            await fs.promises.writeFile(this.path, JSON.stringify(updatedCarts),'utf-8');
            return true;
        }catch(error) {
            console.error(error);
            return false;
        }
    }

};

module.exports = CartManager;