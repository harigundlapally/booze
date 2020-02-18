const mongoose = require('mongoose');

const cartScheme = mongoose.Schema({
    userId : { type : String, required : true},
    productId : { type : String, required : true},
    quantity : { type : Number, required : true},
    created : { type : String, required : true},
    modified : { type : String, required : true},
    status : { type : String, required : true}
});

module.exports = mongoose.model('Cart',cartScheme);