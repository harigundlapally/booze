const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const Cart = require('../models/cart');
const Product = require('../models/product');
const Wishlist = require('../models/wishlist');

//get item from cart
router.get('/:userId',checkAuth,(req,res,next) => {
    Cart.aggregate(
        [ { 
            $match : { 
                        userId : req.params.userId 
                     } 
          },
          { 
            $group: { 
                        _id: null,
                        count: { 
                                    $sum: "$quantity" 
                               } 
                    } 
          } 
        ], (err, result) => {
            res.status(200).json({
                message : 'Cart fetched succesfully',
                result
            });
        });
});

//get cart items in cart page
router.get('/cartItems/:userId',checkAuth,(req,res,next) => {
    try {
    Cart.aggregate(
        [ 
            {
                $match : { 
                            userId : req.userData.userId,
                            status : 'Active'
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
                  "quantity" : 1,
                  "productInfo" : {
                        "_id" : 1,
                        "listPrice" : 1,
                        "name" : 1,
                        "image" : 1,
                        "categoryId" : 1
                  }
                }
            }
        ], (err, result) => {
            (async () => {
                let allWishlists = await Wishlist.find({
                    userId : req.userData.userId
                }).then((wishlists) => {
                    wishlists.map(wishlist => wishlist.wishlistSelected = false);
                    return wishlists;
                });
                result.map((cartItem) => {
                    allWishlists.find(wishlist => {
                        if(wishlist.productId == cartItem.productInfo[0]._id){
                            cartItem.wishlistSelected = true;
                            return cartItem;
                        }
                    });
                });
                res.status(200).json({
                    message : 'Cart fetched succesfully',
                    result
                });
            })();
        });
    } catch (err) {
        next(err);
    }
});

//add item to cart
router.post('/save',checkAuth,(req,res,next) => {
    let fetchedCartItem;
    let queryParam = req.query.cart;
    Cart.find({
        userId : req.body.userId,
        productId : req.body.productId,
        status : 'Active'
    }).then(result => {
        fetchedCartItem = result[0];
        let cart = new Cart({
            userId : req.body.userId,
            productId : req.body.productId,
            quantity: req.body.quantity,
            created : new Date(),
            modified : new Date(),
            status : 'Active'
        });
        if(!result.length){
            cart.save().then(resultAdd => {
                res.status(201).json({
                    message : 'Cart saved successfully',
                    cart : resultAdd
                });
            });
        }else{
            if(queryParam === 'listPage'){
                cart.quantity = (fetchedCartItem.quantity + 1);
            }
            cart._id = fetchedCartItem._id;
            Cart.updateOne({
                _id : fetchedCartItem._id
            },cart).then(resultUpdate => {
                res.status(200).json({
                    message : 'Cart updated successfully',
                    cart : resultUpdate
                })
            });
        }
    });
});

//delete item from cart
router.post('/delete',checkAuth,(req,res,next) => {
    Cart.find({
        userId : req.body.userId,
        productId : req.body.productId,
        status : 'Active'
    }).then(result => {
        if(result.length){
            Cart.deleteOne({
                _id : result[0]._id
            }).then(response => {
                res.status(200).json({
                    message : 'Item deleted successfully'
                })
            })
        }
    });
});

module.exports = router;