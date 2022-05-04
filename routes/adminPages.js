const express = require('express')
const router = express.Router() //初始化路由
const { body, validationResult } = require('express-validator');
const Page = require('../models/page');

const auth = require('../config/auth');
const isAdmin = auth.isAdmin;

// GET page index 页面
router.get('/pages',isAdmin,function(req,res){
    // index必须是ejs文件，不能是html文件，不然报错
    Page.find({}).sort({sorting:1}).exec(function(err,pages){
        res.render('admin/pages',{
            pages:pages
        })
    })
})

// GET add page 页面
router.get('/pages/add-page',isAdmin,function(req,res){
    const title = "";
    const slug = "";
    const content = "";
    res.render('admin/add_page',{
        title:title,
        slug:slug,
        content:content,
    })
})
// POST add page 页面：// post 商品信息(title,slug,content) 到database中
router.post('/pages/add-page',
    // Validation
    body('title').isLength({ min: 1 }).withMessage('Title must have a value.'),
    body('content').isLength({ min: 1 }).withMessage('Content must have a value.'),
    function(req,res){
        
        // req.checkBody('title','Title must have a value').notEmpty();
        // req.checkBody('content','Content must have a value').notEmpty();
        const title = req.body.title;
        let slug = req.body.slug.replace(/\s+\g/,'-').toLowerCase();
        if(slug === "") slug = title.replace(/\s+\g/,'-').toLowerCase();
        const content = req.body.content;
        const errors = validationResult(req);

        // Finds the validation errors in this request and wraps them in an object with handy functions
        // 如果没错误，那么error.isEmpty()返回false,否则返回true
        if(!errors.isEmpty()){
            // 如果有错误，title和content输入没有按规定            
            req.flash('danger',errors.errors.map(err=> (err.msg)))
            res.render('admin/add_page',{
                title:title,
                slug:slug,
                content:content,
            })
            // console.log('Errors',title,slug,content)
            // return res.status(400).json({ errors: errors.array() });
            
        }else{
            // 如果没错误，需要把数据放到database中
            // console.log('Success!')
            Page.findOne({slug:slug},function(err,page){
                if(page){
                    req.flash('danger',' Page slug exists,choose another')
                    res.render('admin/add_page',{
                        title:title,
                        slug:slug,
                        content:content,
                    })
                }else{
                    const page = new Page({
                        title:title,
                        slug:slug,
                        content:content,
                        sorting:100
                    })
                    page.save(function(err){
                        if(err) return console.log(err)
                        // 更新全局的pages变量
                        Page.find({}).sort({sorting:1}).exec(function(err,pages){
                            if(err) console.log(err)
                            // set global pages variable
                            req.app.locals.pages = pages;
                        })
                        
                        req.flash('success',' Page added!')
                        res.redirect('/admin/pages')
                    })
                    
                }
            })
        }
})
// POST reorder pages 页面
router.post('/pages/reorder-pages',function(req,res){
    const ids = req.body;
    for(let i=0;i<ids.length;i++){
        // console.log(ids[i])
        Page.findById(ids[i],function(err,page){
            page.sorting = i
            page.save(function(err){
                if(err) return console.log(err)
                // 更新全局的pages变量
                Page.find({}).sort({sorting:1}).exec(function(err,pages){
                    if(err) console.log(err)
                    // set global pages variable
                    req.app.locals.pages = pages;
                })
                
            })
        })
    }
    
    // console.log(req.app.locals.pages)
    
})
// GET edit page 页面
router.get('/pages/edit-page/:id',isAdmin,function(req,res){
    
    Page.findById(req.params.id,function(err,page){
        
        if(err) return console.log(err)
        res.render('admin/edit_page',{
            title:page.title,
            slug:page.slug,
            content:page.content,
            id:page._id
        })
    })
    
   
})

// POST edit page 页面
router.post('/pages/edit-page/:id',
    // Validation
    body('title').isLength({ min: 1 }),
    body('content').isLength({ min: 1 }),
    function(req,res){
        
        
        // req.checkBody('title','Title must have a value').notEmpty();
        // req.checkBody('content','Content must have a value').notEmpty();
        const title = req.body.title;
        let slug = req.body.slug.replace(/\s+\g/,'-').toLowerCase();
        if(slug === "") slug = title.replace(/\s+\g/,'-').toLowerCase();
        const content = req.body.content;
        const id = req.params.id;
        const errors = validationResult(req);
        

        // Finds the validation errors in this request and wraps them in an object with handy functions
        // 如果没错误，那么error.isEmpty()返回false,否则返回true
        if(!errors.isEmpty()){
            // 如果有错误，title和content输入没有按规定
            res.render('admin/edit_page',{
                title:title,
                slug:slug,
                content:content,
                id:id,
            })
            // console.log('Errors',title,slug,content)
            // return res.status(400).json({ errors: errors.array() });
            
        }else{
            // 如果没错误，需要把数据放到database中
            // console.log('Success!')
            //  $ne:id 选择id 不是当前id值的id
            
            Page.findOne({slug:slug,_id:{$ne:id}},function(err,page){
                // console.log(page)
                if(page){
                    req.flash('danger',' Page slug exists,choose another')
                    res.render('admin/edit_page',{
                        title:title,
                        slug:slug,
                        content:content,
                        id:id,
                    })
                }else{
                    // console.log(id)
                    Page.findById(id,function(err,page){
                        if(err) return console.log(err)
                        page.title = title
                        page.slug = slug
                        page.content = content

                        page.save(function(err){
                            if(err) return console.log(err)
                            // 更新全局的pages变量
                            Page.find({}).sort({sorting:1}).exec(function(err,pages){
                                if(err) console.log(err)
                                // set global pages variable
                                req.app.locals.pages = pages;
                            })
                            req.flash('success',' Page Edited!')
                            res.redirect('/admin/pages/edit-page/'+ page.id)
                        })
                    })
                    
                   
                   
                }
            })
        }
})

// GET delete page 页面
router.get('/pages/delete-page/:id',isAdmin,function(req,res){
    
    Page.findByIdAndRemove(req.params.id,function(err,page){
        if(err) return console.log(err)
        // 更新全局的pages变量
        Page.find({}).sort({sorting:1}).exec(function(err,pages){
            if(err) console.log(err)
            // set global pages variable
            req.app.locals.pages = pages;
        })
        req.flash('success',' Page deleted!')
        res.redirect('/admin/pages/')
    })
    

})

//向外暴露
module.exports = router;
