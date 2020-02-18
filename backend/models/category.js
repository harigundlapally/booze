const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const categorySchema = mongoose.Schema({
    categoryId : {type : String, required : true, unique: true},
    categoryName : {type : String, required : true},
    count:  {type : String, required : false},
});

categorySchema.plugin(uniqueValidator);

module.exports = mongoose.model('Category',categorySchema);