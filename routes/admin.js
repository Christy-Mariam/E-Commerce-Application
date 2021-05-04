var express = require('express');
const { render } = require('../app');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')

/* GET users listing. */
//router.get('/', function (req, res, next) {

// let products = [

//   {
//     name: "New Apple iPhone 12 Pro",
//     description: "(128GB) - Pacific Blue",
//     price: '₹ 1,15,900',
//     image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiNYPxcqCkf06nf6RAMWy6pbA7YJpUKqw3IE1PoC3nPwU28mevG9hMxsqdTWO-v4CDU9k6xUo&usqp=CAc"
//   },

//   {
//     name: "OnePlus 8T 5G",
//     description: "Lunar Silver 12GB RAM, 256GB Storage",
//     price: '₹ 41,999.00',
//     image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWL2V7vQUsuFBM3_zUkoMxuExqpOVBUuU2DAAiUsdz80EXnFeF_4a0gc7nkw&usqp=CAc"
//   },

//   {
//     name: "Realme 8 ",
//     description: "Cyber Black, 128GB, 6GB RAM",
//     price: '₹ 15,999',
//     image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdmBC7cW7Qkv0DylrCV564kjdJTKVyNMBfXbY80p33RfqpoZ_VS_0ntsP8&usqp=CAc"
//   },

//   {
//     name: "Samsung Galaxy M51",
//     description: "Electric Blue, 6GB RAM, 128GB Storage",
//     price: '₹22,999.00',
//     image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqeuPzW7wu9CMZyKxF0kNEjDMQIcG1A-4Zjo6vf9ws9IWFZ8X9KWcaiFYx6V0oPV1mBD36kw&usqp=CAc"
//   }

// ]

//   res.render('admin/view-products', { admin: true, products })
// });

router.get('/', function (req, res, next) {
  productHelpers.getAllProducts().then((products) => {
    console.log(products);
    res.render('admin/view-products', { admin: true, products })
  })
});


router.get('/add-product', function (req, res) {
  res.render('admin/add-product')
})

router.post('/add-product', (req, res) => {
  // console.log(req.body);
  // console.log(req.files.Image);

  productHelpers.addProduct(req.body, (id) => {
    let image = req.files.Image
    image.mv('./public/product-images/' + id + '.jpg', (err) => {
      if (!err) {
        res.render("admin/add-product")
      }
      else {
        console.log(err);
      }
    })
  })
})


router.get('/delete-product/:id', (req, res) => {
  let proId = req.params.id
  console.log(proId);
  productHelpers.deleteProduct(proId).then((response) => {
    res.redirect('/admin/')
  })
})


router.get('/edit-product/:id', async (req, res) => {
  let product = await productHelpers.getProductDetails(req.params.id)
  console.log(product);
  res.render('admin/edit-product', { product })
})


router.post('/edit-product/:id', (req, res) => {
  let id = req.params.id
  productHelpers.updateProduct(req.params.id, req.body).then(() => {
    res.redirect('/admin')

    if (req.files.Image) {
      let image = req.files.Image
      image.mv('./public/product-images/' + id + '.jpg')
    }
  })
})

module.exports = router;
