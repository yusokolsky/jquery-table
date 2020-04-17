let express = require('express');
let app = express();
app.use(express.static('public'));
app.set('port', process.env.PORT || 80);

let server = app.listen(app.get('port'), function() { //identification

    console.log('Сервер запущен на  http://localhost:' + app.get('port') + '  Ctrl-C to terminate');

});