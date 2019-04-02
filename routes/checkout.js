var express = require('express');
var router = express.Router();
var paypal = require('paypal-rest-sdk');
var Cart = require('../models/cart');
var Product = require('../models/product');
var Variant = require('../models/variant');
var Order = require('../models/order');
var Department = require('../models/department');
var Discount = require('../models/discount');



// PayPal Configuration
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AWwgBTMB1MdtTmMRnwZa9yNV_2ZRnrM_nFUq_MqqIWTVf_UY8aq-LXe14ENurK31UJ8oyb8YX-yvpaVj',
  'client_secret': 'EO7yM1sRrAGJk2WSm_PTGVdWZIy2p6hokUIeQZC_jZzABjQRXLHN1qQBfF56IeBSbz8Y9YIF6ga8c8Le'
});

/////////////////////////////////////////////////////////////////////
//
// MIDDLEWARE - Handles GET requests to the checkout page
//
// This basically renders checkout page and set the discount price
// to 0 always.
//
/////////////////////////////////////////////////////////////////////
router.get('/', ensureAuthenticated, function (req, res, next) {
  let cart = new Cart(req.session.cart);
  req.session.cart.discountPrice = 0;
  res.render('checkout', { title: 'Checkout Page', items: cart.generateArray(), totalPrice: cart.totalPrice, bodyClass: 'registration', containerWrapper: 'container' });

})

/////////////////////////////////////////////////////////////////////
//
// MIDDLEWARE - Handles GET requests for adding discount
//
// This basically rediercts to checkout page. I need this because
// I in the post request for apply discount I am rendering another page
// so '/apply-discount' keeps in the address bar. Therefore I just
// created redirect middleware for that reason.
//
/////////////////////////////////////////////////////////////////////
router.get('/apply-discount', ensureAuthenticated, function (req, res, next) {
  res.redirect('/checkout')
})

/////////////////////////////////////////////////////////////////////
//
// MIDDLEWARE - Handles POST requests for adding discount
//
// Checks for the discount codes and if it is applicable then returns
// discounted price.
//
/////////////////////////////////////////////////////////////////////
router.post('/apply-discount', ensureAuthenticated, function (req, res, next) {
  let discountCode = req.body.discountCode;
  Discount.getDiscountByCode(discountCode, function (e, discount) {
    if (e) {
      console.log("Failed on router.get('/checkout/apply-discount')\nError:".error, e.message.error + "\n")
      e.status = 406; next(e);
    }
    else {
      let cart = new Cart(req.session.cart);
      if (discount) {
        let totalDiscount = (cart.totalPrice * discount.percentage) / 100
        totalDiscount = parseFloat(totalDiscount.toFixed(2))
        let totalPrice = cart.totalPrice - totalDiscount;
        totalPrice = parseFloat(totalPrice.toFixed(2))
        cart.discountPrice = totalPrice
        req.session.cart = cart;
        //console.log(req.session.cart)
        res.render('checkout', { title: 'Checkout Page', items: cart.generateArray(), totalPriceAfterDiscount: totalPrice, totalDiscount: totalDiscount, actualPrice: cart.totalPrice, discountPercentage: discount.percentage, bodyClass: 'registration', containerWrapper: 'container' });
      }
      else {
        cart.discountPrice = 0;
        req.session.cart = cart;
        //console.log(req.session.cart)
        res.render('checkout', { title: 'Checkout Page', items: cart.generateArray(), totalPrice: cart.totalPrice, discountCode: discountCode, bodyClass: 'registration', containerWrapper: 'container', msg: "This discount code is not applicable" });
      }
    }
  })
})

/////////////////////////////////////////////////////////////////////
//
// checkout-process - checkout-success - checkout-cancel
// MIDDLEWARE - Handles POST & GET requests
//
// They are just middleware for paypal API. Nothing special about them
// Derived from https://github.com/paypal/PayPal-node-SDK
//
/////////////////////////////////////////////////////////////////////
router.post('/checkout-process', function (req, res) {
  //console.log("Req Obj:", req)
  console.log("checkout process")
  let cart = new Cart(req.session.cart);
  let totalPrice = (req.session.cart.discountPrice > 0) ? req.session.cart.discountPrice : cart.totalPrice;

  //TODO: IMPLEMENT PAYMENT THROUGH PAYPAL
  // send paypal pay request 
  // read result and set paypalSuccess accordingly

  var payReq = JSON.stringify({
    intent: 'sale',
    payer: {
      payment_method: 'paypal'
    },
    redirect_urls: {
      return_url: 'https://tristanzon.herokuapp.com/checkout/checkout-success',
      cancel_url: 'https://tristanzon.herokuapp.com/checkout/checkout-cancel'
    },
    transactions: [{
      amount: {
        total: totalPrice,
        currency: 'CAD'
      },
      description: cart.userId + " : " + totalPrice
    }]
  });

  // create a payment in the paypal api described way. 

  paypal.payment.create(payReq, function (err, payment) {
    var links = {}
    //console.log("Payment: ", payment)

    if (err) {
      console.log("payment.create error")
      console.log(err.details)
    } else {
      console.log("payment.create not in error")
      payment.links.forEach(l => {
        links[l.rel] = {
          href: l.href,
          method: l.method
        }
      })

      if (links.hasOwnProperty('approval_url')) {
        //either of these two could work
        //res.render('checkoutSuccess', {title: 'Successful', containerWrapper: 'container', userFirstName: req.user.fullname})
        console.log("redirecting to approval url")

        console.log("Check Out User: ", req.user)


        res.redirect(302, links['approval_url'].href)
      } else {
        //either of these two could work
        //res.render('checkoutCancel', {title: 'Successful', containerWrapper: 'container', userFirstName: req.user.fullname})
        res.redirect(302, 'https://tristanzon.herokuapp.com/checkout/checkout-cancel')
      }
    }
  })

  //console.log("Result = ", result)
});

router.get('/checkout-success', ensureAuthenticated, function (req, res) {
  //TODO: IMPLEMENT PAYMENT THROUGH PAYPAL
  console.log("checkout success")
  let cart = new Cart(req.session.cart);
  let totalPrice = (req.session.cart.discountPrice > 0) ? req.session.cart.discountPrice : cart.totalPrice;
  res.render('checkoutSuccess', {
    title: 'Successful',
    containerWrapper: 'container'
  });

  let paymentId = req.query.paymentId
  let payerId = { payer_id: req.query.PayerID }


  paypal.payment.execute(paymentId, payerId, function (error, payment) {
    if (error) {
      console.log("payment.execute error")
      console.log("XXX: ", error)
      console.log("XXX")
    } else {
      if (payment.state === "approved") {
        console.log('payment completed successfully')
        // console.log(payment)
        // console.log("Request.user: ", req.user)
        // console.log("Request.session.cart: ", req.session.cart)
        // console.log("Request.payment: ", req.payment)

        //console.log("Req In Payment Succeeded: ", req)

        console.log("Username: ", req.user.username)

        let newOrder = new Order({
          orderID: req.query.paymentId,
          username: req.user.username,
          address: req.user.address,
          orderDate: Date().toString(),
          shipping: true,
          total: totalPrice
        })

        newOrder.save((e, r) => {
          if (e) {
            console.log("error saving order")
            console.log(e)
          }
          console.log("New Order Saved")
        })



        decreaseInventory(req.session.cart.items, (success) => {
          if (success === true) {
            console.log("Successfully decreased quantity of items bought.")
          }
        })

        console.log("Old Session Car Items: ", req.session.cart.items)

        req.session.cart.items = {}

        console.log("New Session Car Items: ", req.session.cart.items)
      } else {
        console.log('payment execution unsuccessfull')
      }
    }
  })
});

router.get('/checkout-cancel', ensureAuthenticated, function (req, res) {
  res.render('checkoutCancel', { title: 'Successful', containerWrapper: 'container' });
});

/////////////////////////////////////////////////////////////////////
//
// MIDDLEWARE - Handles GET requests for the buy now page
//
// This middleware works for in couple steps;
//      if there is no product in the shopping bag then creates a bag
//      then add to item in the bag then go to checkout page.
//
//      if there is a product in the shopping bag then add to selected
//      item in the bag then go to checkout page.
//
/////////////////////////////////////////////////////////////////////
router.get('/buy-now/:id', ensureAuthenticated, function (req, res, next) {
  let productId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});
  Product.findById(productId, function (e, product) {
    if (e) {
      console.log("Failed on router.get('/add-to-bag/:id')\nError:".error, e.message.error + "\n")
      e.status = 406; next(e);
    }
    else {
      if (product) {
        cart.add(product, product.id);
        cart.userId = req.user._id;
        req.session.cart = cart;
        res.render('checkout', { title: 'Checkout Page', items: cart.generateArray(), totalPrice: cart.totalPrice, bodyClass: 'registration', containerWrapper: 'container' });
      }
      else {
        Variant.findById(productId, function (e, variant) {
          if (e) {
            console.log("Failed on router.get('/add-to-bag/:id')\nError:".error, e.message.error + "\n")
            e.status = 406; next(e);
          }
          else {
            Product.findById(variant.productID, function (e, p) {
              let color = (variant.color) ? "- " + variant.color : "";
              variant.title = p.title + " " + color
              variant.price = p.price
              cart.add(variant, variant.id);
              req.session.cart = cart;
              res.render('checkout', { title: 'Checkout Page', items: cart.generateArray(), totalPrice: cart.totalPrice, bodyClass: 'registration', containerWrapper: 'container' });
            })
          }
        })
      }
    }
  })
});


/////////////////////////////////////////////////////////////////////
//
// Function decreaseInventory
//
// Decrease the inventory quantity whenever a customer buy an item.
//
/////////////////////////////////////////////////////////////////////
function decreaseInventory(cartItems, callback) {
  for (let item in cartItems) {
    let qty = cartItems[item].qty;
    console.log("QTY IS: ", qty)
    Product.getProductByID(item, function (e, p) {
      if (p) {
        Product.findOneAndUpdate({ "_id": item },
          {
            $set: {
              "quantity": p.quantity - qty,
            }
          },
          { new: true }, function (e, result) {

          });
      }
      else {
        Variant.getVariantByID(item, function (e, v) {
          Variant.findOneAndUpdate({ "_id": item },
            {
              $set: {
                "quantity": v.quantity - qty,
              }
            },
            { new: true }, function (e, result) {

            });
        });
      }
    });
  }

  return callback(true)
}

/////////////////////////////////////////////////////////////////////
//
// Function ensureAuthenticated()
//
// Check if the user authenticated or not. If not returns to login page
//
/////////////////////////////////////////////////////////////////////
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    Department.getAllDepartments(function (e, departments) {
      req.session.department = JSON.stringify(departments)
      return next();
    })
  }
  else {
    req.flash('error_msg', 'You are not logged in');
    res.redirect('/');
  }
};

module.exports = router;
