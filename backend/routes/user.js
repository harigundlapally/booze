const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');
const User = require('../models/user');

//singup a user
router.post('/signup',(req,res,next) => {
    bcrypt.hash(req.body.password,10)
          .then(hash => {
            const user = new User({
                firstName : req.body.firstName,
                lastName : req.body.lastName,
                gender : req.body.gender,
                email : req.body.email,
                password : hash,
            });
            user.save().then(result => {
               res.status(201).json({
                   message : 'User created successfully',
                   result : result
               });
            }).catch(err => {
                 res.status(500).json({
                     error : err
                 })
            });
    });
});

//Login a user
router.post('/login',(req,res,next) => {
    let fetchedUser;
    User.findOne({email : req.body.email})
        .then(user => {
            if(!user){
                return res.status(401).json({
                    message : 'Auth failed'
                });
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password,user.password);
        })
        .then(result => {
            if(!result){
                return res.status(401).json({
                    message : 'Auth failed'
                });
            }
            const token = jwt.sign({
                email : fetchedUser.email,
                userId : fetchedUser._id
            },'secret code for security',{
                expiresIn : '1h',
            });
            res.status(200).json({
                token : token,
                expiresIn : 3600,
                user : fetchedUser
            });
        })
        .catch(error => {
            return res.status(401).json({
                message : 'Auth failed',
                err : error
            });
        });
});


//update a user
router.post('/updateUser',checkAuth,(req,res,next) => {
    User.updateOne(
        {_id : req.userData.userId},
        {
            $set : {
                        firstName : req.body.firstName,
                        lastName : req.body.lastName,
                        gender : req.body.gender
                   }
        }
    ).then(result => {
        res.status(200).json({
            message : 'User updated successfully',
            result
        })
    });
});

//get a user
router.get('/userInfo',checkAuth,(req,res,next) => {
    User.findOne(
        {_id : req.userData.userId},
    ).then(result => {
        const user = {
            firstName: result.firstName,
            lastName: result.lastName,
            gender: result.gender,
            email: result.email
        }
        res.status(200).json({
            message : 'User updated successfully',
            result : user
        })
    });
});

//update password
router.post('/updatePassword',checkAuth,(req,res,next) => {
    User.findOne(
        {_id : req.userData.userId,email : req.userData.email},
    ).then(user => {
        if(!user){
            return res.status(401).json({
                message : 'Auth failed'
            });
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.currentPassword,user.password);
    })
    .then(result => {
        if(!result){
            return res.status(401).json({
                message : 'Password invalid'
            });
        }
        bcrypt.hash(req.body.newPassword,10)
            .then(hash => {
                User.updateOne(
                    {_id : req.userData.userId},
                    {
                        $set : {
                                    password : hash
                               }
                    }
                ).then(result => {
                    res.status(200).json({
                        message : 'User password updated successfully',
                        result
                    })
                });
        });
    })
    .catch(error => {
        return res.status(401).json({
            message : 'Auth failed',
            err : error
        });
    });
});

module.exports = router;