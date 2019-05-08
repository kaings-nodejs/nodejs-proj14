const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.find()
  .then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  })
  .catch(err => {
    console.log(err);
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findById(prodId)
  .then(product => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
  })
  .catch(err => {
    console.log(err);
  });
};

exports.getIndex = (req, res, next) => {
  Product.find()
  .then(products => {
    //console.log(products)
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  })
  .catch(err => {
    console.log(err)
  });
};

exports.getCart = (req, res, next) => {
  req.user
  .populate('cart.items.productId')   // populate related 'Product' into path 'cart.items.productId' (as set in model as ref in the same path)
  .execPopulate()   // convert populate into Promise
  .then(userData => {
    console.log('getCart_cartItems..... ', userData.cart.items)
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: userData.cart.items
    });
  })
  .catch(err => {console.log(err)});
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
  .then(product => {
    console.log('postCart_product..... ', product);
    return req.user.addToCart(product);
  })
  .then(result => {
    console.log('postCart_result..... ', result);
    res.redirect('/cart');
  })
  .catch(err => {console.log(err)});
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  req.user.deleteItemFromCart(prodId)
  .then(result => {
    console.log('postCartDeleteProduct_result..... ', result);
    res.redirect('/cart');
  })
  .catch(err => {console.log(err)});
};

exports.postOrder = (req, res, next) => {
  req.user.addOrder()
  .then(result => {
    console.log('postOrder_result..... ', result);
    res.redirect('/orders');
  })
  .catch(err => {console.log(err)});
};

exports.getOrders = (req, res, next) => {
  req.user.getOrders()
  .then(orders => {
    console.log('getOrders_orders..... ', orders);
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    });
  })
  .catch(err => {console.log(err)});

  // req.user
  // .getOrders({include: ['copy_sqlz_products']})
  // .then(orders => {
  //   console.log('getOrders_orders..... ', orders);
  //   res.render('shop/orders', {
  //     path: '/orders',
  //     pageTitle: 'Your Orders',
  //     orders: orders
  //   });
  // })

  
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
