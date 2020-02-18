const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    categoryId : {type : String, required : true},
    name : {type : String, required : true},
    image : {type : String, required : true},
    description : {type : String, required : true},
    additional_information : {type : String, required : true},
    special_features : {type : Array, required : true},
    listPrice : {type : Number, required : true},
    salePrice : {type : Number, required : true},
    featuredProduct : {type : Boolean, required : true},
    bestSellerProduct : {type : Boolean, required : true},
    newArrivalProduct : {type : Boolean, required : true},
    bannerProduct : {type : Boolean, required : true},
    selected : {type : Boolean}
});

module.exports = mongoose.model('Product',productSchema);