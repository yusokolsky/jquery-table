let express = require('express');
let app = express();
var bodyParser = require('body-parser');
var jsonfile = require('jsonfile');
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('port', process.env.PORT || 80);
let file = 'items.json';
let items = [];
let server = app.listen(app.get('port'), function() { //identification
    console.log('Сервер запущен на  http://localhost:' + app.get('port') + '  Ctrl-C to terminate');
    jsonfile.readFile(file, function(err, obj) {                                                        //on server start read file
        items = obj
    })
});
app.post('/getitems', function(req, res) {                              //send files
    res.json(items);
})
app.post('/deleteitem', function(req, res) {                               //delete item
    let idToDelete = req.body.id;
    items.splice(items.findIndex(s => s.id == idToDelete), 1);
    jsonfile.writeFile(file, items, function(err) {
        if (err) res.send(err)
        else res.json(items);
    });
})
app.post('/senditem', function(req, res) {
    let item = req.body;
    item.count = parseInt(item.count);
    item.price = parseFloat(item.price.replace(/[^0-9.]/g, ""));
    item.delivery = {
        country: item.country,
        cities: [item.city1, item.city2, item.city3]
    }
    delete item.country;
    delete item.city1;
    delete item.city2;
    delete item.city3;
    if (item.id) {                                          //id retruns only if we edit existing item
        items = items.map(old => {
            if (parseInt(old.id) === parseInt(item.id)) {
                return item;
            }
            return old;
        });
    } else {
        if (items.length > 0)
            item.id = parseInt(items[items.length - 1].id) + 1;
        else item.id = 1;
        items.push(item);
    }
    jsonfile.writeFile(file, items, function(err) {
        if (err) res.send(err)
        else res.send(items);
    });
    //res.send(true);
});