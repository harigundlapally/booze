const mongoose = require('mongoose');

const orderScheme = mongoose.Schema({
    productIds : { type : Array, required : true},
    orderDate : { type : String, required : true},
    addressId : { type : String, required : true},
    userId : { type : mongoose.Schema.Types.ObjectId,ref: 'User', required : true},
    deliveryChargesAmount : { type : Number, required : true},
    subtotalAmount : { type : Number, required : true},
    totalAmount : { type : Number, required : true},
    paymentType : { type : String},
    paymentToken : { type : String},
});

module.exports = mongoose.model('Order',orderScheme);