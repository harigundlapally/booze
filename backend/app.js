const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose'); 
const bodyParser = require('body-parser');
const categoryRouters = require('./routes/category');
const productRouters = require('./routes/product');
const userRouters = require('./routes/user');
const cartRouters = require('./routes/cart');
const wishlistRouters = require('./routes/wishlist');
const addressRouters = require('./routes/address');
const orderRouters = require('./routes/order');

mongoose.connect("mongodb+srv://hari:o226DMeCTSObEU4v@cluster0-xarnh.mongodb.net/node-angular?retryWrites=true&w=majority",{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => {
            console.log('MongoDB connected');
        })
        .catch(() => {
            console.log('Connection Failed');
        });


app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept,Authorization');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE,OPTIONS,PUT');
    if(req.method == 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE,OPTIONS,PUT');
        return res.status(200).json({});
    }
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

//products routes
app.use('/api/product',productRouters);

//users routes
app.use('/api/user',userRouters);

//category routes
app.use('/api/category',categoryRouters);

//cart routes
app.use('/api/cart',cartRouters);

//wishlist routes
app.use('/api/wishlist',wishlistRouters);

//wishlist routes
app.use('/api/address',addressRouters);

//order routes
app.use('/api/order',orderRouters);

//handle error
app.use((req,res,next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error,req,res,next) => {
    res.status(error.status || 500)
        .json({
            message : error.message
        })
});

module.exports = app;