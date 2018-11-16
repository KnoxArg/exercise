var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');
var mongoose = require('mongoose');
var async = require('async');

mongoose.connect('mongodb://mongo/items', { useNewUrlParser: true });


var ItemSchema = new mongoose.Schema({
    item_id: {
        type: String,
        unique: true,
        required: true,
    },
    b64image: {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        min: 0,
        required: true
    }
});

var ItemModel = mongoose.model('Item', ItemSchema);

const maxPostSize = "10mb"; // MB allowed to send 
var app = express();


var items = []; 


app.use(express.static('client')); //We serve the static content from the "client" folder

//We use body parser to access data posted back with req.body
app.use(bodyParser.urlencoded({limit: maxPostSize, extended:true}));
app.use(bodyParser.json({limit: maxPostSize}));


app.get('/items', function(req,res){
    ItemModel.find({}).sort('order').exec(function(err,items){
        res.json(items);
    });
});


app.post('/items', function(req,res){
    var item = req.body;

    ItemModel.findOne({})
    .sort('-order').limit(1)  // give me the max
    .exec(function (err, itemInDb)
    { 
        if (!itemInDb){
            item.order = 0;
        }       
        else{
            item.order = itemInDb.order + 1;
        }
        ItemModel.create(item);
        res.send(item);
    });
    
});

app.post('/updateorder', function(req,res){
    var arrItemIDs = req.body.order.split("&");
    let itemOrder = 0;


    async.mapSeries(arrItemIDs, function (itemIDs,next){
        var id = itemIDs.split("=")[1];
        ItemModel.findOne({ item_id: "item_" + id }, function (err, itemFound){
            itemFound.order = itemOrder
            itemOrder++;
            itemFound.save(function(err, item){
                if (err){
                  console.log(err);
                }
                next();      
            });
                 
        });
    }, function(err) {
         console.log(err);
    });

    res.send();
    
});


app.put('/item/:id', function(req,res){
    var update = req.body;
    if(update.item_id){
        delete update.item_id; // We prevent id from being updated.
    }

    ItemModel.findOne({ item_id: req.params.id }, function (err, item){
        var updatedItem = _.assign(item,update);
        item.save();
        res.json(item);
      });
});

app.delete('/items/:id', function(req,res){
    ItemModel.findOneAndRemove({item_id: req.params.id},
        function(err,item){
            res.json(item);
        });
})


var port = 3000;
app.listen(port, function(){
    console.log('listening on http://localhost:' + port);
});