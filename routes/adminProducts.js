const express = require('express')
const router = express.Router() //初始化路由
const { body, validationResult } = require('express-validator');
const mkdirp = require('mkdirp')
const fs = require('fs-extra')
const resizeImg = require('resize-img')
const path = require('path');

const auth = require('../config/auth');
const isAdmin = auth.isAdmin;

// get product model
const Product = require('../models/product');
// get category model
const Category = require('../models/category');

// GET products index 页面
router.get('/products',isAdmin,function(req,res){
    
    const cnt = Product.countDocuments(function(err, docCount) {
        if (err) { return console.log(err) } //handle possible errors
        const cnt = docCount;
        Product.find(function(err,products){
            res.render('admin/products',{
                products:products,
                cnt:cnt
            })
        })
    })  

})

// GET add product 页面
router.get('/products/add-product',isAdmin,function(req,res){
    const title = "";
    const description = "";
    const price = "";
    Category.find((err,categories)=>{
        res.render('admin/add_product',{
            title:title,
            description:description,
            price:price,
            categories:categories
        })
    })
    
})
// console.log(path.extname(value).toLowerCase())
// POST add product 页面：// post 到database中

router.post('/products/add-product',
    // Validation
    body('title').isLength({ min: 1 }).withMessage('Title must have a value.'),
    body('description').isLength({ min: 1 }).withMessage('Description must have a value.'),
    body('price').isDecimal().withMessage('Price must have a value.'),
    
    // 自定义validator
    // body('image').is
    // 图片校验有误？？？？？？
    // body('image').custom((value, { req }) => {
    //     if (!req.files) throw new Error("Image must be uploaded");
    //     return true;
    // }),
        // files => {
        // // alert(req)
        // return files !== undefined ? true : false;
        // const extensions = path.extname(imageFile).toLowerCase()
        // console.log(extensions)
        // switch(extensions){
        //     case '.jpg': return '.jpg';
        //     case '.jpeg': return '.jpeg';
        //     case '': return '.jpg';
        //     case '.png': return '.png';
        //     default: return false
  
    function(req,res){
        // console.log(body('image').isLength({ min: 1 }))
        const title = req.body.title;
        let slug = title.replace(/\s+\g/,'-').toLowerCase();
        const description = req.body.description;
        const price = req.body.price;
        const category = req.body.category;
        const imageFile = req.files != null ? req.files.image.name : "";

        const errors = validationResult(req);
        // console.log(errors.errors)

        // Finds the validation errors in this request and wraps them in an object with handy functions
        // 如果没错误，那么error.isEmpty()返回false,否则返回true
        if(!errors.isEmpty()){
            // 如果有错误，title和content输入没有按规定
            req.flash('danger',errors.errors.map(err=> (err.msg)))
            Category.find((err,categories)=>{                
                res.render('admin/add_product',{
                    title:title,
                    description:description,
                    price:price,
                    categories:categories,
                })
            })            
            
            // console.log('Errors',title,slug,content)
            // return res.status(400).json({ errors: errors.array() });
            
        }else{
            // 如果没错误，需要把数据放到database中
            // console.log('Success!')
            
            Product.findOne({slug:slug},function(err,product){
                if(product){
                    req.flash('danger',' Page title exists,choose another')
                    Category.find((err,categories)=>{                
                        res.render('admin/add_product',{
                            title:title,
                            description:description,
                            price:price,
                            categories:categories,
                        })
                    })
                }else{
                    // console.log(imageFile)
                    const product = new Product({
                        title:title,
                        slug:slug,
                        description:description,
                        price:parseFloat(price).toFixed(2),
                        category:category,
                        image:imageFile
                    });
                    product.save(function(err){
                        if(err) return console.log(err)
                    //     mkdirp('public/product_images/'+ product._id,(err)=>{
                    //         return console.log(err)
                    //     });
                        // return value is a Promise resolving to the first directory created
                        mkdirp('public/product_images/'+ product._id).then(made =>
                            {
                                console.log(`made directories, starting with ${made}`)
                                if(imageFile !== ""){
                                    let productImage = req.files.image;
                                    // console.log(productImage)
                                    const filepath = 'public/product_images/'+ product._id+'/' + imageFile;
                                    // 文件上传
                                    productImage.mv(filepath,err=> {
                                        return console.log(err)
                                    })
                                }
                            }
                            ).catch(err=>console.log(err));
                        mkdirp('public/product_images/'+ product._id + '/gallery').then(made =>
                            console.log(`made directories, starting with ${made}`)).catch(err=>console.log(err));
                        mkdirp('public/product_images/'+ product._id + '/gallery/thumbs').then(made =>
                            console.log(`made directories, starting with ${made}`)).catch(err=>console.log(err));
                        
                        
                        req.flash('success',' Product added!')
                        res.redirect('/admin/products')
                    })
                }
            })
        }
    }
)

// GET edit product 页面
router.get('/products/edit-product/:id',isAdmin,function(req,res){
    
    Product.findById(req.params.id,function(err,product){
        
        if(err) return console.log(err)
        Category.find((err,categories)=>{   
            // console.log(categories) 
            const gallaryDir = 'public/product_images/' + product._id + '/gallery';
            let galleryImages =  null;
            fs.readdir(gallaryDir,function(err,files){
                if(err){
                    console.log(err);
                }else{
                    galleryImages = files;
                    // console.log('test',galleryImages)
    
                    res.render('admin/edit_product',{
                        title:product.title,
                        description:product.description,
                        price:parseFloat(product.price).toFixed(2),
                        categories:categories,
                        category:product.category.replace(/\s+\g/,'-').toLowerCase(),
                        image:product.image,
                        galleryImages:galleryImages,
                        id:product._id,
                    })
                }
                
            })
            
        })
    })
   
})

// POST edit page 页面
router.post('/products/edit-product/:id',
    // Validation
    body('title').isLength({ min: 1 }).withMessage('Title must have a value.'),
    body('description').isLength({ min: 1 }).withMessage('Description must have a value.'),
    body('price').isDecimal().withMessage('Price must have a value.'),
    
    function(req,res){
        
        const title = req.body.title;
        let slug = title.replace(/\s+\g/,'-').toLowerCase();
        const description = req.body.description;
        const price = parseFloat(req.body.price).toFixed(2);
        const category = req.body.category;
        // console.log(req.files)

        const imageFile = req.files != undefined ? req.files.image.name : ""; // 上传的image
        const hiddenImage = req.body.hiddenImage; // 记录了数据库里原先有的image
  
        const id = req.params.id;
        
        const errors = validationResult(req);
        

        // Finds the validation errors in this request and wraps them in an object with handy functions
        // 如果没错误，那么error.isEmpty()返回false,否则返回true
        if(!errors.isEmpty()){
            // 如果有错误，title和content输入没有按规定
            res.redirect('admin/products/edit_product' + id);
            
        }else{
            // 如果没错误，需要把数据放到database中
            // console.log('Success!')
            //  $ne:id 选择id 不是当前id值的id
            
            Product.findOne({slug:slug,_id:{$ne:id}},function(err,product){
                // console.log(page)
                if(err) console.log(err);
                if(product){
                    req.flash('danger',' Page title exists,choose another')
                    res.redirect('admin/products/edit_product' + id);
                    
                }else{
                    
                    // console.log(id)
                    Product.findById(id,function(err,product){
                        if(err) return console.log(err)
                        product.title = title
                        product.slug = slug
                        product.description = description
                        product.price = price
                        product.category = category
                        if (imageFile != "") {
                            product.image = imageFile;
                        }
                        
                        product.save(function(err){
                            
                            if(err) return console.log(err)
                            if (imageFile != "") {
                                if (hiddenImage != "") {
                                    // 如果图片重新上传了，就要删除原来的图片
                                    fs.remove('public/product_images/'+ id + '/'+ hiddenImage,function(err){
                                        if(err) console.log(err);
                                    })
                                }
                                
                                // 上传了的新图片，要移动到指定文件夹下
                                let productImage = req.files.image;
                                // console.log(productImage)
                                const filepath = 'public/product_images/'+ product._id+'/' + imageFile;
                                // 文件上传
                                productImage.mv(filepath,err=> {
                                    return console.log(err)
                                })                            
                            }   
                            req.flash('success',' Product Edited!')
                            res.redirect('/admin/products/edit-product/'+ id)
                        })
                    })
                   
                   
                }
            })
        }
})
// POST product gallery 页面 
router.post('/products/product-gallery/:id',function(req,res){
    const productImage = req.files.file;
    const id = req.params.id;
    const filepath = 'public/product_images/'+ id + '/gallery/' + productImage.name;
    const thumbsPath = 'public/product_images/'+ id + '/gallery/thumbs/'+ productImage.name;
    // 文件上传
    productImage.mv(filepath,err=> {
        if (err) console.log(err);
        resizeImg(fs.readFileSync(filepath),{width:100,height:100}).then(buf=>{
            fs.writeFileSync(thumbsPath, buf);
        })
    })        
    res.sendStatus(200);
})

// GET delete delete-image  页面 /admin/products/delete-image/<%= img %>?id=<%= id %> 
router.get('/products/delete-image/:image',function(req,res){
    const originalImage = 'public/product_images/'+ req.query.id + '/gallery/' + req.params.image;
    const thumbsPath = 'public/product_images/'+ req.query.id + '/gallery/thumbs/'+ req.params.image;
    fs.remove(originalImage,err=>{
        if(err) return console.log(err);
        fs.remove(thumbsPath,err=>{
            if(err) return console.log(err);
            req.flash('success',' Image deleted!')
            res.redirect('/admin/products/edit-product/'+ req.query.id)
        })
    })
})
// GET delete product 页面 
router.get('/products/delete-product/:id',isAdmin,function(req,res){
    // 删除Public/product_imagse下对应id的图片
    const path = 'public/product_images/'+ req.params.id;
    fs.remove(path,err=>{
        if(err) return console.log(err);
        // 删除数据库对应的product
        Product.findByIdAndRemove(req.params.id,function(err,product){
            if(err) return console.log(err)
            req.flash('success',' Product deleted!')
            res.redirect('/admin/products/')
        })
    })
    
})

//向外暴露
module.exports = router;
