const express = require('express');
const Product = require('../models/product');
const Wishlist = require('../models/wishlist');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

//get all products
router.get('',(req,res,next) => {
    const productQuery = Product.find();
    const currentPage = +req.query.page;
    const pageSize = +req.query.pageSize;
    let fetchedProducts;
    if(currentPage && pageSize){
        productQuery.skip(pageSize * (currentPage - 1))
                    .limit(pageSize);
    }
    productQuery.then(documents => {
                    fetchedProducts = documents;
                    return Product.countDocuments();
                })
                .then(count => {
                    res.status(200).json({
                        message : 'Products fetched successfully',
                        count : count,
                        allProducts : fetchedProducts
                    });
                })
                .catch(error => {
                    console.log(error);
                });
});

//get by category
router.get('/browse',(req,res,next) => {
    const userId = '5e3940e2084e2a36201be509';
    let isLoggedIn = req.query.isLoggedIn;
    let productQuery;
    const query = (req.query.category && req.query.category != 'all') ? {categoryId : req.query.category} : (req.query.category == 'all' && req.query.category == undefined) ? {} : {};
    const sort = (req.query.sort) == 'low_to_high' ? { salePrice : 1 } :  (req.query.sort) == 'high_to_low' ? { salePrice : -1 } : (req.query.sort) == 'default' ? { salePrice : -1 } : {};
    if(query != {}){
        productQuery = Product.find(query);
    }else if(sort != {}){
        productQuery = Product.find(query).sort(sort);
    }
    let fetchedProducts;
    if(isLoggedIn === 'false' || isLoggedIn === undefined || isLoggedIn === ''){
        productQuery.then(documents => {
                        fetchedProducts = documents;
                        return documents.length;
                    })
                    .then(count => {
                        return res.status(200).json({
                            message : 'Products fetched successfully',
                            count : count,
                            allProducts : fetchedProducts
                        });
                    })
                    .catch(error => {
                        return console.log(error);
                    });
    }else{
        (async () => {
            let allWishlists = await Wishlist.find({
                userId : userId
            }).then((wishlists) => {
                return wishlists;
            });
            let productData = await productQuery.then(documents => {
                                fetchedProducts = documents.map(product => {
                                    product.selected = false;
                                    return product;
                                });
                                return documents.length;
                            })
                            .then(count => {
                                fetchedProducts = fetchedProducts.map(product => {
                                    allWishlists.find(wishlist => {
                                        if(wishlist.productId == product._id){
                                            product.selected = true;
                                        }
                                    });
                                    return product;
                                });
                                return {
                                    count : count,
                                    allProducts : fetchedProducts
                                };
                            })
                            .catch(error => {
                                return console.log(error);
                            });

            res.status(200).json({
                message : 'Products fetched successfully',
                count : productData.count,
                allProducts : productData.allProducts
            });
        })();
    }
});

//get by category
router.get('/browseByPrice',(req,res,next) => {
    const query = (req.query.price && req.query.price != '') ? {listPrice: {$lte: req.query.price}} : '';
    const productQuery = Product.find(query);
    let fetchedProducts;

    productQuery.then(documents => {
                    fetchedProducts = documents;
                    return documents.length;
                })
                .then(count => {
                    res.status(200).json({
                        message : 'Products fetched successfully',
                        count : count,
                        allProducts : fetchedProducts
                    });
                })
                .catch(error => {
                    console.log(error);
                });
});

//get product by id
router.get('/:id',(req,res,next) => {
    Product.findById(req.params.id)
           .then(product => {
                if(product){
                    res.status(200).json({
                        message : 'Product fetched successfully',
                        product
                    });
                }else{
                    res.status(404).json({
                        message : 'Product not found'
                    });
                }
           })
           .catch(error => {
               console.log(error);
           });
});

//Add new product
router.post('',(req,res,next) => {
    const product = new Product({
        categoryId : req.body.categoryId,
        name : req.body.name,
        image : req.body.image,
        description : req.body.description,
        additional_information : req.body.additional_information,
        special_features : req.body.special_features,
        listPrice : req.body.listPrice,
        salePrice : req.body.salePrice,
        featuredProduct : req.body.featuredProduct,
        bestSellerProduct : req.body.bestSellerProduct,
        newArrivalProduct : req.body.newArrivalProduct,
        bannerProduct : req.body.bannerProduct
    });
    product.save(result => {
        res.status(201).json({
            message : 'Product saved successfully',
            // productId : result._id
        });
    });
});

//Update product
router.put('/:id',(req,res,next) => {
    const product = new Product({
        _id : req.params.id,
        categoryId : req.body.categoryId,
        name : req.body.name,
        image : req.body.image,
        description : req.body.description,
        additional_information : req.body.additional_information,
        special_features : req.body.special_features,
        listPrice : req.body.listPrice,
        salePrice : req.body.salePrice,
        featuredProduct : req.body.featuredProduct,
        bestSellerProduct : req.body.bestSellerProduct,
        newArrivalProduct : req.body.newArrivalProduct,
        bannerProduct : req.body.bannerProduct
    });

    Product.updateOne({
        _id : req.params.id
    },product).then(result => {
        res.status(200).json({
            message : 'Product updated successfully',
            product : result
        })
    });
});

//Delete product
router.delete('/:id',checkAuth,(req,res,next) => {
    Product.deleteOne({
        _id : req.params.id
    }).then((result) => {
        res.status(200).json({
            message : 'Post deleted successfully'
        });
    });
});

module.exports = router;