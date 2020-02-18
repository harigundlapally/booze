const mongoose = require('mongoose');

const addressScheme = mongoose.Schema({
    userId : { type : String, required : true},
    defaultAddress : { type : Boolean},
    name : { type : String, required : true},
    contactNumber : { type : String, required : true},
    address : { type : String, required : true},
    state : { type : Number, required : true},
    city : { type : String, required : true},
    email : { type : String, required : true},
    country : { type : String, required : true},
    pinCode : { type : String, required : true},
});

module.exports = mongoose.model('Address',addressScheme);