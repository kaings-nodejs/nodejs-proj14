const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
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
  Product.fetchAll()
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
  req.user.getCart()
  .then(products => {
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: products
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
  let fetchedCart;

  req.user
  .getCart()
  .then(cart => {
    fetchedCart = cart;

    console.log('postOrder_cart..... ', cart);
    console.log('postOrder_cart.cartItem..... ', cart.cartItem); // undefined
    return cart.getCopy_sqlz_products();
  })
  .then(products => {
    console.log('postOrder_products..... ', products);
    products.map(product => {console.log('postOrder_product.cartItem..... ', product.cartItem.quantity)}); // cartItem can be accessed via product

    return req.user
    .createOrder()
    .then(order => {
      return order.addCopy_sqlz_products(products.map(product => {
        product.orderItem = {quantity: product.cartItem.quantity};
        return product;
      }));
    })
    .then(result => {
      fetchedCart.setCopy_sqlz_products(null);

      res.redirect('/orders');
    })
    .catch(err => {console.log(err)});
  })
  .catch(err => {console.log(err)})
};

exports.getOrders = (req, res, next) => {
  req.user
  .getOrders({include: ['copy_sqlz_products']})
  .then(orders => {
    console.log('getOrders_orders..... ', orders);
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    });
  })

  
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
