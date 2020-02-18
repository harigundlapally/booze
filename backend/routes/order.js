const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const Order = require('../models/order');
const Cart = require('../models/cart');
const Product = require('../models/product');
const Address = require('../models/address');
const ObjectId = require('mongodb').ObjectId; 


//add item to order
router.post('',checkAuth,(req,res,next) => {
    const order = new Order({
        userId : req.userData.userId,
        productIds : req.body.productIds,
        orderDate : new Date(),
        addressId : req.body.addressId,
        subtotalAmount : req.body.subtotalAmount,
        deliveryChargesAmount : req.body.deliveryChargesAmount,
        totalAmount : req.body.totalAmount,
        paymentType : req.body.paymentType,
        paymentToken : req.body.paymentToken
    });
    order.save().then(result => {
        if(!result){
            return res.status(500).json({
                message : 'Data not inserted'
            })
        }
        Cart.updateMany(
            { userId : req.userData.userId },
            { $set: { "status" : 'Inactive' } }
        ).then(response => {
            res.status(201).json({
                message : 'Order placed successfully',
                result
            })
        });
    });
});


//get order items
router.get('',checkAuth,async (req,res,next) => {
    try {
        const userId = req.userData.userId;
        let orderArray = [];
        if(userId){
            let allProductIds = [];
            let allAddressIds = [];
            const fetchedOrders = await Order.find({userId}).sort({"orderDate" : 1});
            fetchedOrders.map((order) => {
                order.productIds.map((product)=> {
                    allProductIds.push(product.productId);
                });
                allAddressIds.push(order.addressId);
            });
            const fetchedProducts = await Product.find({
                _id : {
                    $in : allProductIds
                }
            });

            const fetchedAddresses = await Address.find({
                _id : {
                    $in : allAddressIds
                }
            });

            fetchedOrders.forEach(order => {
                let orderObj = {
                    order_id : order._id,
                    subtotalAmount : order.subtotalAmount,
                    deliveryChargesAmount : order.deliveryChargesAmount,
                    totalAmount: order.totalAmount,
                    paymentType: order.paymentType,
                    products : [],
                };
                order.productIds.map((productIds)=> {
                    fetchedProducts.find(product => {
                        if(product._id == productIds.productId){
                            var productObj = {
                                'name' : product.name,
                                'image' : product.image,
                                'listPrice' : product.listPrice,
                                'productId' : product._id,
                                'quantity' : productIds.quantity
                            }
                            orderObj.products.push(productObj);
                        }
                    });
                });

                //add aaddress
                fetchedAddresses.filter(address => {
                    if(address._id == order.addressId){
                        address.userId = undefined;
                        orderObj.address = address;
                    }
                });
                orderArray.push(orderObj);
                
            });
            res.status(200).json({
                message : 'Orders fetched successfully',
                count : orderArray.length,
                orders : orderArray
            });
        }
      } catch (err) {
        next(err);
      }
});

module.exports = router;