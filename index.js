let express = require('express');
let app = express();
let bodyParser = require('body-parser');

// 设置public为静态文件
app.use('/public', express.static('public'));
// 设置路由
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
require('./router/routerIndex')(app);

let getCollection = require('./mongo/getDb');

let inventory = getCollection('inventory');

/*inventory.find({item: 'kaikai'}, (err, res) => {
    res.each((er, band) => {
        console.log(band);
    })
})*/



app.listen('3334', () => {
    console.log('The server is listening on port 3334');
});