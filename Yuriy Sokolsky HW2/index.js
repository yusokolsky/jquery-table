let express = require('express');
let app = express();
var bodyParser = require('body-parser');
var jsonfile = require('jsonfile');
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('port', process.env.PORT || 80);
let file='Products.json';
let Products=[];
let server = app.listen(app.get('port'), function() { //identification

    console.log('Сервер запущен на  http://localhost:' + app.get('port') + '  Ctrl-C to terminate');

    jsonfile.readFile(file, function(err, obj) {Products=obj})
});

app.post('/sendProduct/', function(req, res) {

   let Product=req.body;
    Product.id=Products.length;
    Product.count=parseInt(Product.count);
    Product.price=parseFloat(Product.price.slice(1));
    Product.delivery={
        country:Product.country,
        cities:[Product.city1,Product.city2,Product.city3]
    }
    delete Product.country;
    delete Product.city1;
    delete Product.city2;
    delete Product.city3;
    Products.push(Product);
    jsonfile.writeFile(file, Products);

    res.end();
});

