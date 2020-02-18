const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const Wishlist = require('../models/wishlist');

//get item from cart
router.get('',checkAuth,(req,res,next) => {

    Wishlist.aggregate(
        [ 
            {
                $match : { 
                            userId : req.userData.userId,
                         } 
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "productId",
                    as: "productInfo"
                }
            },
            {
                $project : {
                    "_id" : 1,
                    "productInfo" : {
                        "_id" : 1,
                        "listPrice" : 1,
                        "name" : 1,
                        "image" : 1,
                    }
                }
            }
        ], (err, result) => {
            const wishlist = result.map(wishlist => {
                return {
                    '_id' : wishlist._id,
                    'name' : wishlist.productInfo[0].name,
                    'image' : wishlist.productInfo[0].image,
                    'listPrice' : wishlist.productInfo[0].listPrice,
                    'productId' : wishlist.productInfo[0]._id,
                }
            })
            res.status(200).json({
                message : 'Cart fetched succesfully',
                result,
                wishlist
            });
        });
});


//add item to cart
router.post('/save',checkAuth,(req,res,next) => {
    Wishlist.find({
        userId : req.body.userId,
        productId : req.body.productId
    }).then(result => {
        let wishlist = new Wishlist({
            userId : req.body.userId,
            productId : req.body.productId,
        });
        if(!result.length){
            wishlist.save().then(wishlist => {
                res.status(201).json({
                    message : 'Wishlist saved successfully',
                    wishlist
                });
            });
        }
    });
});

//delete item from wishlist
router.post('/delete',checkAuth,(req,res,next) => {
    const userId = req.userData.userId;
    if(userId){
        Wishlist.find({
            userId : userId,
            productId : req.body.productId
        }).then(result => {
            if(result.length){
                Wishlist.deleteOne({
                    _id : result[0]._id
                }).then(response => {
                    res.status(200).json({
                        message : 'Wishlist Item removed successfully',
                    })
                })
            }
        });
    }
});

module.exports = router;