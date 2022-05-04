const express = require('express')
const router = express.Router() //初始化路由
const { body, validationResult } = require('express-validator');
const Category = require('../models/category');

const auth = require('../config/auth');
const isAdmin = auth.isAdmin;

// GET category index (主页面) 页面
router.get('/categories',isAdmin,function(req,res){
  
    // index必须是ejs文件，不能是html文件，不然报错
    Category.find(function(err,categories){
        if(err) return console.log(err)
        res.render('admin/categories',{
            categories:categories
        })
    })
})

// GET add category 页面
router.get('/categories/add-category',isAdmin,function(req,res){
    const title = "";
    res.render('admin/add_category',{
        title:title,
    })
})
// POST add category 页面：// post 商品信息(title,slug,content) 到database中
router.post('/categories/add-category',
    // Validation
    body('title').isLength({ min: 1 }).withMessage('Title must have a value.'),
    function(req,res){
        const title = req.body.title;
        const slug = title.replace(/\s+\g/,'-').toLowerCase();
        const errors = validationResult(req);

        // Finds the validation errors in this request and wraps them in an object with handy functions
        // 如果没错误，那么error.isEmpty()返回false,否则返回true
        if(!errors.isEmpty()){
            // 如果有错误，title和content输入没有按规定
            req.flash('danger',errors.errors.map(err=> (err.msg)))
            res.render('admin/add_category',{
                title:title,
            })
            
            // console.log('Errors',title,slug,content)
            // return res.status(400).json({ errors: errors.array() });
            
        }else{
            // 如果没错误，需要把数据放到database中
            // console.log('Success!')
            Category.findOne({slug:slug},function(err,category){
                if(category){
                    req.flash('danger',' Category title exists,choose another')
                    res.render('admin/add_category',{
                        title:title
                    })
                }else{
                    const category = new Category({
                        title:title,
                        slug:slug,
                    })
                    category.save(function(err){
                        if(err) return console.log(err)
                        // update categories variable
                        Category.find(function(err,categories){
                            if(err) console.log(err)
                            // set global categories variable
                            req.app.locals.categories = categories;
                        })

                        req.flash('success',' Category added!')
                        res.redirect('/admin/categories')
                    })
                }
            })
        }
})

// GET edit category 页面
router.get('/categories/edit-category/:id',isAdmin,function(req,res){
    
    Category.findById(req.params.id,function(err,category){
        
        if(err) return console.log(err)
        res.render('admin/edit_category',{
            title:category.title,
            id:category._id
        })
    })
   
})

// POST edit category 页面
router.post('/categories/edit-category/:id',
    // Validation
    body('title').isLength({ min: 1 }),
    function(req,res){
        const title = req.body.title;
        const slug  = title.replace(/\s+\g/,'-').toLowerCase();
        const errors = validationResult(req);
        const id = req.params.id

        // Finds the validation errors in this request and wraps them in an object with handy functions
        // 如果没错误，那么error.isEmpty()返回false,否则返回true
        if(!errors.isEmpty()){
            // 如果有错误，title和content输入没有按规定
            res.render('admin/edit_category',{
                title:title,
                id:id,
            })
            // console.log('Errors',title,slug,content)
            // return res.status(400).json({ errors: errors.array() });
            
        }else{
            // 如果没错误，需要把数据放到database中
            // console.log('Success!')
            //  $ne:id 选择id 不是当前id值的id
            
            Category.findOne({slug:slug,_id:{$ne:id}},function(err,category){
                // console.log(page)
                if(category){
                    req.flash('danger',' Category title exists,choose another')
                    res.render('admin/edit_category',{
                        title:title,
                        id:id,
                    })
                }else{
                    // console.log(id)
                    Category.findById(id,function(err,category){
                        if(err) return console.log(err)
                        category.title = title
                        category.slug = slug

                        category.save(function(err){
                            if(err) return console.log(err)
                            // update categories variable
                            Category.find(function(err,categories){
                                if(err) console.log(err)
                                // set global categories variable
                                req.app.locals.categories = categories;
                            })
                            req.flash('success',' Category Edited!')
                            res.redirect('/admin/categories/edit-category/'+ id)
                        })
                    })
                   
                   
                }
            })
        }
})

// GET delete page 页面
router.get('/categories/delete-category/:id',isAdmin,function(req,res){
    
    Category.findByIdAndRemove(req.params.id,function(err,category){
        if(err) return console.log(err)
        // update categories variable
        Category.find(function(err,categories){
            if(err) console.log(err)
            // set global categories variable
            req.app.locals.categories = categories;
        })
        req.flash('success',' Category deleted!')
        res.redirect('/admin/categories/')
    })

})

//向外暴露
module.exports = router;
