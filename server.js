const express = require('express')
const mongoose = require('mongoose');
const config = require('./config/database')
const bodyParser = require('body-parser');
const session = require('express-session')
// const { body, validationResult } = require('express-validator');
const fileUpload = require('express-fileupload')
const passport = require('passport')

// 连接mongodb数据库
mongoose.connect(config.database,()=>{
    console.log('Connected!')
},e=>{
    console.error(e)
});

//初始化app
const app = express(); 
// view引擎设置
app.set('view engine','ejs'); 
// 设置public文件夹
app.use(express.static('public')); 

// get page model (page是菜单栏)
const Page = require('./models/page');
// get all pages and pass to header.ejs
Page.find({}).sort({sorting:1}).exec(function(err,pages){
    if(err) console.log(err)
    // set global pages variable
    app.locals.pages = pages;
})

// get category model (page是菜单栏)
const Category = require('./models/category');
// get all categories and pass to header.ejs
Category.find(function(err,categories){
    if(err) console.log(err)
    // set global categories variable
    app.locals.categories = categories;
})

// body parser中间件 
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


// express-fileupload 中间件
app.use(fileUpload())


// express session 中间件
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  // cookie: { secure: true }
}))

// express validator中间件


// express-message 中间件
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// password config
require('./config/passport')(passport);
// password 中间件
app.use(passport.initialize());
app.use(passport.session());
// 
app.get('*',(req,res,next)=>{

  res.locals.cart = req.session.cart;
  res.locals.user = req.user || null;
  next();
})

// 设置路由
const pages = require('./routes/pages') // 客户端主菜单
const adminPages = require('./routes/adminPages')
const adminCategories = require('./routes/adminCategories')
const adminProducts = require('./routes/adminProducts')
const allProducts = require('./routes/allProducts')
const cart = require('./routes/cart');
const users = require('./routes/users');

app.use('/admin',adminPages);
app.use('/admin',adminCategories);
app.use('/admin',adminProducts);
app.use('/all-products',allProducts);
app.use('/cart',cart);
app.use('/users',users);
app.use('/',pages);

const PORT = process.env.PORT || 3000;
app.listen(PORT)

