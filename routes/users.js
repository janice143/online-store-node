const express = require('express')
const User = require('../models/user')
const router = express.Router() //初始化路由
const passport = require('passport')
const bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator');

// get register
router.get('/register',function(req,res){
    res.render('register',{
        title:'Register',
    })
})

// POST register
router.post('/register',
    // validation
    body('name').isLength({min:1}).withMessage('Name is required!'),
    body('email').isEmail().withMessage('Email is required!'),
    body('username').isLength({min:1}).withMessage('Username is required!'),
    body('password').isLength({min:1}).withMessage('Name is required!'),
    body('password2').custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }
    
        // Indicates the success of this synchronous custom validator
        return true;
      }),
    function(req,res){
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const username = req.body.username;
        const password2 = req.body.password2;

        const errors = validationResult(req);

        // Finds the validation errors in this request and wraps them in an object with handy functions
        // 如果没错误，那么error.isEmpty()返回false,否则返回true
        if(!errors.isEmpty()){
            // 如果有错误，title和content输入没有按规定
            req.flash('danger',errors.errors.map(err=> (err.msg)))
            res.render('register',{
                title:'Register',
                cart:undefined,
                user:null
            })
            
        }else{
            User.findOne({username:username},(err,user)=>{
                if(err) return console.log(err);
                if(user){
                    req.flash('danger','Unsername exist, choose anther')
                    res.redirect('/users/register');
                }else{
                    const user = new User({
                        name:name,
                        username:username,
                        email:email,
                        password:password,
                        admin:0
                    });
                    bcrypt.genSalt(10,function(err,salt){
                        bcrypt.hash(user.password,salt,function(err,hash){
                            if(err) return console.log(err);
                            user.password = hash;
                            user.save(err=>{
                                if(err) return console.log(err);
                                req.flash('success','You are now registered')
                                res.redirect('/users/login')
                            })
                        })
                    })
                }
            })
        }
        
})

// get login
router.get('/login',function(req,res){
    if(res.locals.user) res.redirect('/');

    res.render('login',{
        title:'Log in',
    })
})
// POST login
router.post('/login',function(req,res,next){
    passport.authenticate('local',{
        successRedirect:'/',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next);
    
    
})
// get logout
router.get('/logout',function(req,res){
    req.logOut();
    req.flash('success','You are logged out!')
    res.redirect('/users/login')
})
//向外暴露
module.exports = router;
