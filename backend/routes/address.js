const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const Address = require('../models/address');

//add item to address
router.post('/save',(req,res,next) => {
    const address = new Address({
        userId : req.body.userId,
        defaultAddress : false,
        name : req.body.name,
        contactNumber : req.body.contactNumber,
        address : req.body.address,
        state : req.body.state,
        city : req.body.city,
        email : req.body.email,
        country : req.body.country,
        pinCode : req.body.pinCode
    });
    address.save().then(result => {
        res.status(201).json({
            message : 'Address saved successfully',
            result : result._id
        });
    });
});

//update address
router.post('/update',checkAuth,(req,res,next) => {
    Address.findOneAndUpdate(
        { _id : req.body._id, userId : req.body.userId },
        { $set : req.body },
        { new : true },
     ).then(result => {
         if(!result){
             return res.status(401).json({
                 message : 'Unauth user update'
             })
         }
         res.status(200).json({
             message : 'Address updated successfully',
             result
         });
     });
});

//get all addresses
router.get('/:userId',(req,res,next) => {
    Address.find({userId : req.params.userId}).then(documents => {
        res.status(200).json({
            message : 'Address fetched successfully',
            result : documents
        });
    });
});


//make default addresses
router.put('/update',(req,res,next) => {
    let fetchedAddress;
    let address = new Address({
        userId : req.body.userId,
        defaultAddress : false,
        name : req.body.name,
        contactNumber : req.body.contactNumber,
        address : req.body.address,
        state : req.body.state,
        city : req.body.city,
        email : req.body.email,
        country : req.body.country,
        pinCode : req.body.pinCode
    });
    Address.find({
        _id : req.body._id,
        userId : req.body.userId
    }).then(result => {
        fetchedAddress = result[0];
        if(!result){
            res.status(400).json({
                message : 'No address found'
            });
        }
        Address.updateMany(
            { $set: { defaultAddress: false }},
        ).then(resultAddress => {
            address._id = fetchedAddress._id;
            address.defaultAddress = true;
            Address.updateOne({
                _id : req.body._id,
            },address).then(resultUpdate => {
                res.status(200).json({
                    message : 'Address updated successfully',
                    address : resultUpdate
                })
            });
        })
    });
});


//delete item from wishlist
router.post('/delete',checkAuth,(req,res,next) => {
    const userId = req.body.userId
    if(userId){
        Address.find({
            userId : req.body.userId,
            _id : req.body._id
        }).then(result => {
            if(result.length){
                Address.deleteOne({
                    _id : result[0]._id
                }).then(response => {
                    res.status(200).json({
                        message : 'Address deleted successfully'
                    })
                })
            }
        });
    }
});


module.exports = router;