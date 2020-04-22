let express = require('express');
let app = express();
var bodyParser = require('body-parser');
var jsonfile = require('jsonfile');
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('port', process.env.PORT || 8080);
let file = 'Products.json';
let Products = [];
let server = app.listen(app.get('port'), function() { //identification
    console.log('Сервер запущен на  http://localhost:' + app.get('port') + '  Ctrl-C to terminate');
    jsonfile.readFile(file, function(err, obj) {
        Products = obj
    })
});
app.post('/getProducts', function(req, res) {
    res.json(Products);
})
app.post('/deleteProduct', function(req, res) {
    let idToDelete = req.body.id;
    Products.splice(Products.findIndex(s => s.id == idToDelete), 1);
    jsonfile.writeFile(file, Products, function(err) {
        if (err) res.send(err)
        else res.json(Products);
    });
})
app.post('/sendProduct', function(req, res) {
    let Product = req.body;
    Product.count = parseInt(Product.count);
    Product.price = parseFloat(Product.price.replace(/[^0-9.]/g, ""));
    Product.delivery = {
        country: Product.country,
        cities: [Product.city1, Product.city2, Product.city3]
    }
    delete Product.country;
    delete Product.city1;
    delete Product.city2;
    delete Product.city3;
    if (Product.id) { //id retruns only if we edit existing product
        Products = Products.map(old => {
            if (parseInt(old.id) === parseInt(Product.id)) {
                return Product;
            }
            return old;
        });
    } else {
        if (Products.length > 0)
            Product.id = parseInt(Products[Products.length - 1].id) + 1;
        else Product.id = 1;
        Products.push(Product);
    }
    jsonfile.writeFile(file, Products, function(err) {
        if (err) res.send(err)
        else res.send(Products);
    });
    //res.send(true);
});