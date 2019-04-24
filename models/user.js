const mongodb = require('mongodb');
const getDB = require('../util/database').getDB;

class User {
    constructor(username, email, id, cart) {
        this.username = username;
        this.email = email;
        this._id = id;
        this.cart = cart;   // {items: []}
    }

    save() {
        const db = getDB();
        return db.collection('user').insertOne(this);
    }

    addToCart(product) {
        if (!this.cart) {
            this.cart = {items: []};
        }

        const db = getDB();
        const productIndex = this.cart.items.findIndex(prod => prod.productId.toString() === product._id.toString());
        const updatedCartContent = this.cart.items.slice(0);

        if (productIndex < 0) {
            updatedCartContent.push({ productId: new mongodb.ObjectId(product._id), quantity: 1 }); 
        } else {
            updatedCartContent[productIndex].quantity = this.cart.items[productIndex].quantity + 1;
        }

        return db.collection('users').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: {cart: {items: updatedCartContent}}});
    }

    getCart() {
        const db = getDB();
        const productIds = this.cart.items.map(product => product.productId);

        console.log('getCart..... ', productIds);

        return db.collection('products')
        .find({_id: {$in: productIds}})     // $in is used when you wanna find multiple (array) of products
        .toArray()
        .then(products => {
            console.log('getCart_foundProducts..... ', products);
            return products.map(product => {
                return {
                    ...product,
                    quantity: this.cart.items.find(item => item.productId.toString() === product._id.toString()).quantity
                }
            });
        })
        .catch(err => console.log(err));
    }

    static findById(userId) {
        const db = getDB();
        return db.collection('users').findOne({ _id: new mongodb.ObjectId(userId) });   // this will return the object instead. "find()" will return cursor. Therefore, need "next()" or "toArray()"
    }
}

module.exports = User;