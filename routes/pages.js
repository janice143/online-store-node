const express = require('express')
const Page = require('../models/page')
const Product = require('../models/product')
const router = express.Router() //初始化路由

router.get('/',function(req,res){
    res.redirect('/home')
    // Page.findOne({slug:'home'},function(err,page){
    //     if(err) console.log(err);
    //     res.render('index',{
    //         title:page.title,
    //         content:page.content
    //     })
    // })
})
router.get('/home',function(req,res){
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
// GET a page :显示用户主页不同菜单的内容
router.get('/:slug',function(req,res){
   
    const slug = req.params.slug;
    if(slug!=='home'){
        Page.findOne({slug:slug},function(err,page){
            if(err) console.log(err);
            if(!page){
                res.redirect('/')
            }else{
                res.render('index',{
                    title:page.title,
                    content:page.content
                })
                
            }
        })
    }
    
})


//向外暴露
module.exports = router;
