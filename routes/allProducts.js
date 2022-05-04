const express = require('express')
const router = express.Router() //初始化路由
const fs = require('fs-extra')
const Product = require('../models/product')
const Category = require('../models/category')

// const auth = require('../config/auth');
// const isUser = auth.isUser;

// get all products
router.get('/',function(req,res){
    Product.find(function(err,products){
        if(err) console.log(err);
        // console.log(products)
        if(!products){
            res.redirect('/')
        }else{
            res.render('all_products', {
                title: 'All products',
                products: products
            });
        }
    })
})

// get products by category
router.get('/:category',function(req,res){
    const categorySlug = req.params.category;
    // console.log(categorySlug)
    // 确保分类是数据库里有的，所以先得在数据库里找到一个
    Category.findOne((err,category)=>{
        Product.find(({category:categorySlug}),function(err,products){
            if(err) console.log(err);
            
            if(!products){
                res.redirect('/')
            }else{
                res.render('cat_products', {
                    title: category.title,
                    products: products
                });
            }
        })
    })
    
})
// /all-products/<%= product.category %>/<%= product.slug %>
// get product detail
router.get('/:category/:slug',function(req,res){
    let galleryImages = null;
    const loggedIn = (req.isAuthenticated()) ? true : false;

    Product.findOne({slug:req.params.slug},(err,product)=>{
        if(err) console.log(err);
        galleryPath = 'public/product_images/'+ product._id+'/gallery/';
        fs.readdir(galleryPath,(err,files)=>{
            if(err) console.log(err);
            galleryImages = files;
            res.render('pro_detail',{
                product:product,
                title:product.title,
                galleryImages:galleryImages,
                loggedIn:loggedIn
            })
        })
    })
    
})

//向外暴露
module.exports = router;
