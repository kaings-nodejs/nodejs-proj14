const mongodb = require('mongodb');
const getDB = require('../util/database').getDB;

class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  save() {
    const db = getDB();
    return db.collection('products').insertOne(this);
  }

  static fetchAll() {
    const db = getDB();
    return db.collection('products')
    .find()
    .toArray(); // find() return cursor that points to documents. Therefore, toArray() is needed to return Promise. ref: https://docs.mongodb.com/manual/reference/method/cursor.toArray/index.html
  }

  static findById(prodId) {
    const db = getDB();
    return db.collection('products')
    .find( {_id: new mongodb.ObjectId(prodId)} )
    .next();
  }
}


module.exports = Product;