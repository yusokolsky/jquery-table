let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let jsonfile = require('jsonfile');
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('port', process.env.PORT || 80);
let file = 'items.json';
let items = [];

let server = app.listen(app.get('port'), () => { //identification
    console.log(`Сервер запущен на  http://localhost:${app.get('port')}  Ctrl-C to terminate`);
    jsonfile.readFile(file, (err, obj) => {                                                        //on server start read file
        items = obj
    })
});

app.post('/getitems', (req, res) => {                              //send files
    res.json(items);
})

app.post('/deleteitem', ({body}, res) => {                               //delete item
    let idToDelete = body.id;
    items.splice(items.findIndex(({id}) => id == idToDelete), 1);
    jsonfile.writeFile(file, items, err => {
        if (err) res.send(err)
        else res.json(items);
    });
})

app.post('/senditem', ({body}, res) => {
    let item = body;

    item.count = parseInt(item.count);
    item.price = parseFloat(item.price.replace(/[^0-9.]/g, ""));
     item.delivery = {
         country: item.country,
         cities: item.cities
     }
     delete item.cities;
    delete item.country;
     if (item.id) {                                          //id retruns only if we edit existing item
         items = items.map(old => {
             if (parseInt(old.id) === parseInt(item.id)) {
                 return item;
             }
             return old;
         });
     } else {
         let id = Math.max.apply(Math, items.map(function(o) { return o.id; }))

         console.log(id+1);
         item.id = id+1;
         items.push(item);
     }
     jsonfile.writeFile(file, items, err => {
         if (err) res.send(err)
         else res.send(items);
     });
    // //res.send(true);
});