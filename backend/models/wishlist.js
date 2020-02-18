const mongoose = require('mongoose');

const wishlistScheme = mongoose.Schema({
    userId : { type : String, required : true},
    productId : { type : String, required : true},
});

module.exports = mongoose.model('Wishlist',wishlistScheme);