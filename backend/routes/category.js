const express = require('express');
const Category = require('../models/category');
const Product = require('../models/product');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

//get all products
router.get('',(req,res,next) => {
    const categoryQuery = Category.find();
    

    const currentPage = +req.query.page;
    const pageSize = +req.query.pageSize;
    let fetchedCategories;
    if(currentPage && pageSize){
        categoryQuery.skip(pageSize * (currentPage - 1))
                    .limit(pageSize);
    }
    categoryQuery.then(documents => {
                    fetchedCategories = documents;
                    return Category.countDocuments();
                })
                .then(count => {
                    const totalProducts = Product.find({},{categoryId:1});
                    totalProducts.then(resp => {
                        if(resp && resp.length) {
                            fetchedCategories = fetchedCategories.map(category => {
                                const categoryProducts = resp.filter(val => val.categoryId ===category.categoryId);
                                category.count = categoryProducts.length;
                                return category;
                            });
                        }
                        res.status(200).json({
                            message : 'Categories fetched successfully',
                            count : count,
                            allCategories : fetchedCategories
                        });
                    });
                   
                })
                .catch(error => {
                    console.log(error);
                });
});

//get product by id
router.get('/:id',(req,res,next) => {
    Category.findById(req.params.id)
           .then(category => {
                if(category){
                    res.status(200).json(category);
                }else{
                    res.status(404).json({
                        message : 'Category not found'
                    });
                }
           })
           .catch(error => {
               console.log(error);
           });
});

//Add new product
router.post('',(req,res,next) => {
    const category = new Category({
        categoryId : req.body.categoryId,
        categoryName : req.body.categoryName
    });
    category.save(result => {
        res.status(201).json({
            message : 'Category saved successfully',
            category : result
        });
    });
});

//Update product
router.put('/:id',(req,res,next) => {
    const category = new Category({
        _id : req.params.id,
        categoryId : req.body.categoryId,
        categoryName : req.body.categoryName
    });

    Category.updateOne({
        _id : req.params.id
    },category).then(result => {
        res.status(200).json({
            message : 'Category updated successfully',
            category : result
        })
    });
});

//Delete product
router.delete('/:id',(req,res,next) => {
    Category.deleteOne({
        _id : req.params.id
    }).then((result) => {
        res.status(200).json({
            message : 'Post deleted successfully'
        });
    });
});

module.exports = router;