var express = require('express');
// const { response } = require('../app');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')
const userHelpers = require('../helpers/user-helpers')

const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next()
  }
  else {
    res.redirect('/login')
  }
}


/* GET home page. */

//router.get('/', function (req, res, next) {

//   let products = [

//     {
//       name: "New Apple iPhone 12 Pro",
//       description: "(128GB) - Pacific Blue",
//       price: '₹ 1,15,900',
//       image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiNYPxcqCkf06nf6RAMWy6pbA7YJpUKqw3IE1PoC3nPwU28mevG9hMxsqdTWO-v4CDU9k6xUo&usqp=CAc"
//     },

//     {
//       name: "OnePlus 8T 5G",
//       description: "Lunar Silver 12GB RAM, 256GB Storage",
//       price: '₹ 41,999.00',
//       image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWL2V7vQUsuFBM3_zUkoMxuExqpOVBUuU2DAAiUsdz80EXnFeF_4a0gc7nkw&usqp=CAc"
//     },

//     {
//       name: "Realme 8 ",
//       description: "Cyber Black, 128GB, 6GB RAM",
//       price: '₹ 15,999',
//       image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdmBC7cW7Qkv0DylrCV564kjdJTKVyNMBfXbY80p33RfqpoZ_VS_0ntsP8&usqp=CAc"
//     },

//     {
//       name: "Samsung Galaxy M51",
//       description: "Electric Blue, 6GB RAM, 128GB Storage",
//       price: '₹22,999.00',
//       image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqeuPzW7wu9CMZyKxF0kNEjDMQIcG1A-4Zjo6vf9ws9IWFZ8X9KWcaiFYx6V0oPV1mBD36kw&usqp=CAc"
//     }

//   ]

//   res.render('index', { products, admin: false });
// });

router.get('/', function (req, res, next) {
  let user = req.session.user
  console.log(user);
  productHelpers.getAllProducts().then((products) => {
    res.render('user/view-productsuser', { products, user })
  })
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/')
  }
  else {
    res.render('user/login', { "loginErr": req.session.loginErr })
    req.session.loginErr = false
  }
})

router.get('/signup', (req, res) => {
  res.render('user/signup')
})

router.post('/signup', (req, res) => {
  userHelpers.doSignup(req.body).then((response) => {
    console.log(response);
    req.session.loggedIn=true
    req.session.user=response
    res.redirect('/')
  })
})

router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true
      req.session.user = response.user
      res.redirect('/')
    }
    else {
      req.session.loginErr = "Invalid username or password"
      res.redirect('/login')
    }
  })
})

router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

router.get('/cart', verifyLogin, async (req, res) => {
  let products=await userHelpers.getCartProducts(req.session.user._id)
  console.log(products);
  res.render('user/cart',{products,user:req.session.user})
})

router.get('/add-to-cart/:id',verifyLogin,(req,res)=>{
  userHelpers.addToCart(req.params.id,req.session.user._id)
  res.redirect('/')

})


module.exports = router;