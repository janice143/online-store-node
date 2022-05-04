// 只在不是生产环境下才引入该库
if(!process.env.NODE_ENV !=='production'){
    // 引入dotenv包，并且从.env文件中加载数据到process.env中。load values from the ./env file in this direcotry into process.env
    require('dotenv').config();
  }
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUPLIC_KEY
// stripe支付包
const stripe = require('stripe')(stripeSecretKey)

const express = require('express');
const session = require('express-session');
const { check } = require('express-validator');
const { append } = require('express/lib/response');
const router = express.Router() //初始化路由


// get product model
const Product = require('../models/product')

// GET add product to cart
router.get('/add/:product',function(req,res){
    const slug =req.params.product;

    Product.findOne({slug:slug},(err,product)=>{
        if(err) console.log(err);
        // 如果购物车不存在
        
        if(req.session.cart===undefined){
            req.session.cart = [];
            req.session.cart.push({
                title:slug,
                quantity:1,
                price:parseFloat(product.price),
                image:product.image ? '/product_images/'+product._id +'/'+product.image : '/images/noimage.png' 
            })
            
        }else{
            // 如果购物车存在
            const cart = req.session.cart;
            let newItem = true;
            for (item of cart){
                // 如果当前添加的商品在购物车里存在，那么数量++就行
                if(item.title===slug){
                    item.quantity++;
                    newItem = false;
                    break;
                }
            }
            // 如果当前添加的商品在购物车里不存在
            if(newItem){
                cart.push({
                    title:slug,
                    quantity:1,
                    price:parseFloat(product.price),
                    image:product.image ? '/product_images/'+product._id +'/'+product.image : '/images/noimage.png' 
                })
            }
        }
        // console.log(req.session.cart)
        req.flash('success','Product added!')
        res.redirect('back')
    })
})
// get checkout page
router.get('/checkout',(req,res)=>{
    if(req.session.cart && req.session.cart.length===0){
        delete req.session.cart
        res.redirect('/cart/checkout')
    }else{
        res.render('checkout',{
            title:'checkout',
            cart: req.session.cart,
            stripePublicKey:stripePublicKey
        })
    }
    
})

// get update product
router.get('/update/:product',(req,res)=>{
    const slug = req.params.product;
    const cart = req.session.cart;
    const action = req.query.action;
    for(let i=0;i<cart.length;i++){
        if(cart[i].title===slug){
            switch(action){                
                case "add":
                    cart[i].quantity++;
                    break;
                case "remove":
                    cart[i].quantity--;
                    if(cart[i].quantity<1) cart.splice(i,1)
                    break;
                case "clear":
                    cart.splice(i,1)
                    if(cart.length===0) delete req.session.cart
                    break;
                default:
                    console.log('Update have a problem.')
                    break;
            }
            break;
        }
    }

    // req.flash('success','Product added!')
    // console.log(cart)
    res.redirect('/cart/checkout')
})
// get clear cart cart/clear
router.get('/clear',(req,res)=>{
    delete req.session.cart
    req.flash('success','Cart cleared!')
    res.redirect('/cart/checkout')
})

// post purchase
router.post('/purchase',(req,res)=>{

    let total = 0;
    const titles = req.body.items.map(item=>item.title);

    // console.log(req.body.items,titles)
    Product.find({slug:titles},(err,products)=>{
        if(err) console.log(err);
        // console.log(item,product)
        if(products){
            // prices.push(product.price)
            products.forEach((product,i)=>{
                // console.log(product.title,req.body.items[i])
                total += product.price * req.body.items[i].quantity
            })
            console.log(total)
            // stripe的total是用美分计算的，，所以要*100
            stripe.charges.create({
                // total金额要在1美元以上
                amount: parseFloat(total).toFixed(2)*100,
                source: req.body.stripeTokenId,
                currency: 'usd'
            }).then(function() {
                // 清空购物车
                delete req.session.cart
                // You're using a res in the then callback, and that one shadows the res from the router.post. 
                console.log('Charge Successful')
                res.json({ message: 'Successfully purchased items' })
                    
            }).catch(function(e) {           
                console.log(e.message,'Charge Fail')
                res.status(500).end()
            })
        }

        
    })
    


    
})
//向外暴露
module.exports = router;
