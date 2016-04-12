  validator = require('validator'),
  Project = models.Project,
  Product = models.Product;
//PRODUCT START

// list products
router.get('/products', function(req,res){
  Product.find(function(err, products){
    res.render('admin/products',{
      products
    })
  })
})


// new products
router.get('/product', function(req, res){
  const product = {}
  res.render('admin/product', {product} )
})

// view/edit projects
router.get('/product/:id', function(req,res){
  var id = req.params.id;
  Product.findOne({_id: id}, function(err, product){
    res.render('admin/product', {
      product
    })
  })
})

// add new/edit
router.post('/product', function(req, res){
  var id = req.body._id
  var body = req.body;
  
  var errors = [];
  if (!validator.isCurrency(body.price)) 
    errors.push('Price is not valid');
  
  if (errors.length) {
    console.log(errors);
    req.flash('errors', {msg: errors.join('<br>')});
    return res.redirect('/admin/product/'+id);
  }
  
  Product.findOne({_id: id}, function(err, product){
    if(product){
      product.name=body.name;
      product.description=body.description;
      product.price=body.price;
      product.image_url=body.image_url
      product.save(function(err, saved){
        req.flash('success', {msg: body.name + ' saved'});
        res.redirect('/admin/products');
      })
    } else{
      var product = new Product({
        name: body.name,
        description: body.description,
        price: body.price,
        image_url: body.image_url
      })

      product.save(function(err, saved) {
        req.flash('success', {msg: body.name + ' saved'});
        res.redirect('/admin/products');
      })
    }
  })
})

router.get('/product/delete/:id', function(req, res){
  Product.remove({_id: req.params.id}, function(err){
    if(err){
      req.flash('error', {msg: err.message} )
    }else{
      req.flash('success', {msg: 'deleted'} )
    }
    return res.redirect('/admin/products')
  })
});

//PRODUCT END