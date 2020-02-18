const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userScheme = mongoose.Schema({
    firstName : { type: String, required: true},
    lastName : { type: String, required: true},
    gender : { type: Number, required: true},
    email : { type: String, required : true, unique : true},
    password : { type: String, required : true},
});

userScheme.plugin(uniqueValidator);

module.exports = mongoose.model('User',userScheme);