# 基于EJS+Node.js+MongoDB的全栈电商平台（全英文）

Full stack ecommerce online store application

| *后台管理账号* |
| -------------- |
| 用户名：admin  |
| 密码：123456   |

## 项目介绍

网页效果： https://janice143.github.io/sortWithoutArticles/

本项目为基于EJS+Node.js+MongoDB技术实现的全栈电商平台，用户可以在平台上浏览，搜索所需商品，商家可以在后台上传商品信息并实时发布到平台，供用户进行购买，数据库会实时向用户展示平台上的各种商品。

本项目是前后端分离开发，前后端功能需求完全独立，数据上相互依靠。前端包括以下几点的核心功能模块：1）商品列表展示模块；2）商品详情模块；3）商品分类展示模块；4）登录模块；5）注册模块；6）购物车模块；7）网站主页菜单栏编辑、添加、删除模块；8）商品类别编辑、添加、删除模块；9）商品信息编辑、添加、删除模块。

后端主要实现的功能为：1）按类名查询商品列表功能；2）用户登录和注册功能；3）对购物车相应数据的增加、删除、更新和清空功能；4）订单支付功能；5）对商品类别的数据增加、编辑、删除功能；6）对商品的数据增加、编辑、删除功能；7）对网站主页菜单栏的数据增加、编辑、删除功能

本项目采用的技术是：

前端：bootstrap, ejs

后端：node.js,  express, express-router, stripe, mongodb, mongoose,  express-validator, dropzone, passport

## 项目功能界面

![](https://github.com/janice143/myblog.github.io/blob/master/images/node_online_store.png?raw=true)

## 系统设计

### 1 功能模块分析

前端采用bootstrap框架来实现页面的快速响应式布局记忆快速搭建。同时使用了EJS这类高效的嵌入式 JavaScript 模板引擎，用来实现动态的数据渲染。后端基于Nodejs 的Express 服务架构，使用非关系型数据库MongoDB 数据支持。整个系统使用流行的MVC 框架结构，实现了表现层、逻辑层和数据层的分离。
系统完成之后，可以为买家用户提供商品浏览购买等服务，为卖家提供商品以及商品类别的增添、删除和编辑等功能。

（1）商品列表展示模块：实现商品列表的整体布局和组件拆分，根据服务器响应的数据，以及EJS模板引擎实现动态地渲染页面。

（2）商品分类展示模块：使用mongoose的数据库查找功能，按照商品类别（category），查找对应的商品，并把数据给页面进行展示。

（3）登录模块：主要实现网站的登录，和用户校验功能，当用户未进行登录时不可以对购买商品进行加入购物车操作，只能进行商品的查看，在后台中添加请求拦截可以实现此功能。用户登录后可以实现加入购物车以及购买商品等一系列操作。

（4）注册模块：主要实现网站账号的注册，注册过程中有些文本框需要满足一定的要求，比如用户名，名字等不能为空，利用express-validator来实现校验。

（5）购物车模块：把商品加入购物车后回显示商品的数目，购物车结算页面中可以进行商品的增加、减少，清除功能。最后还包括对整个购物车的一键清除，以及支付功能。其中支付功能采用了stripe的接口，可以利用stripe的卡号来进行实际的支付功能。

~~88888888---除了上述列出的一系列重要模块之外，本系统还利用---88888888888~~



### 2 数据库设计

采用MongoDB数据库，这种非关系型数据库拥有以json格式进行数据传输与存储，没有烦琐的业务关系的处理，并且与node.js兼容性非常的良好。采用MongoDB 数据库中自带的Mongoose 类库作为中间件解决数据集合中数据操作问题，并且使用MongoDBCompass图形化管理数据。

本系统准备了四张表，名字分别为category（存储商品类名信息），page（存储主页导航栏信息），product（存储商品信息），user（存储用户信息）。

### 3 前端路由

![image-20220503160012828](C:\Users\superjanice\AppData\Roaming\Typora\typora-user-images\image-20220503160012828.png)





## 项目开发详解

### 项目初始化

 1 npm init

2 新建server.js文件

3 安装express包 npm i --save express。在server.js文件中编写下述代码

```js
const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.listen(3000)
```

4 在控制台中输入命令 node server.js .一个nodejs服务器就启动了

访问: [http://localhost:3000](http://localhost:3000)

### 项目源码目录设计

```md
config 文件夹 配置mongodb服务器、用户登录的passport等
models 文件夹 mongoose的数据模型
public 文件夹 放一些静态的css,js以及图片等，产品图片也会通过建立文件夹的形式存储在本文件夹中
routes 文件夹 存放路由
views 文件夹 视图层，用来渲染数据
.env 文件 环境变量配置，用来存放一些重要、敏感的信息，比如密钥等

```

### 项目用到的库和插件

```markdown
express node.js Web应用框架, 提供各种特性和丰富的 HTTP 工具实现各种 Web 应用的创建。可以快速地搭建一个完整功能的网站。

ejs JS模板引擎，模板文件后缀.ejs，<% 内容 %>。语法简单，上手容易

body-parser 一般用到express框架都需要用这个中间件，用于处理 JSON, Raw, Text 和 URL 编码的数据。通俗地讲，用了body-parser中间件之后，我们的请求对象中就多了一个body属性，可以通过req.body显示出传入参数。(可以参考这篇博客 https://segmentfault.com/a/1190000041169686)

express-session 服务器储存。在本项目中用来存储用户购物车一类的数据

express-validator 表单验证器

express-messages 提供Flash 通知渲染

express-fileupload 接受从客户端传来的图片，并将图片作为文件存储在服务端

fs-extra 文件操作，fs的一个扩展，提供了非常多的便利API，并且继承了fs所有方法和为fs方法添加了promise的支持

mkdirp 不仅可以创建文件夹，还可以创建多层的文件夹

connect-flash flash通知

Mongoose 在 nodeJs 异步环境下对 mongodb 进行便捷操作的对象模型工具。

bcryptjs 密码加密以及解密匹配
passport 登录验证（身份认证的一种），功能单一，只能做登录验证，但非常强大，支持本地账号验证和第三方账号登录验证（OAuth和OpenID等），支持大多数Web网站和服务
passport-local passport的依赖包，本地认证，本地身份验证

resize-img 调整图片大小，比如说奥村图片的时候，重新调大小

sortablejs JavaScript 拖拽库。可用于列表拖拽排序、以及低代码拖拽配置等场景

stripe 支付接口

bootstrap 基于HTML、CSS、JavaScript的前端框架,响应式前端布局

dropzone 文件拖拽上传功能

fileupload 实现图片上传

viewerjs  大图预览（https://github.com/fengyuanchen/viewerjs）
```

#### Express Messages的基本使用

作用：提供flash通知的渲染

```js
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
req.flash("info", "Email queued");
req.flash("info", "Email sent");
req.flash("error", "Email delivery failed");
```

渲染messages, 根据所使用的的模板引擎执行messages函数。

```ejs
EJS:
<%- messages() %>
```

#### Connect Flash的基本使用

flash是配合session使用的，所以在使用flash之前，要引入express-session模块，它往往用在登录和注册，消息只会通知一次就消失了，其中redirect和flash是不能分开使用的。

With the `flash` middleware in place, all requests will have a `req.flash()` function that can be used for flash messages.

```js
app.get('/flash', function(req, res){
  // Set a flash message by passing the key, followed by the value, to req.flash().
  req.flash('info', 'Flash is back!')
  res.redirect('/');
});

app.get('/', function(req, res){
  // Get an array of flash messages by passing the key to req.flash()
  res.render('index', { messages: req.flash('info') });
});
```

#### Mongoose基本使用

*本部分内容主要参考了这篇博客，因为这篇文章写得很详细，想看更多细节，可以点击[链接](https://juejin.cn/post/6918945758968283144)*

##### 1 引入 mongoose 并连接数据库

```js
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test'); 
如果有账户密码需要采用下面的连接方式： 
mongoose.connect('mongodb://eggadmin:123456@localhost:27017/eggcms'); 
复制代码
```

##### 2 定义 Schema

数据库中的 Schema，为数据库对象的集合。schema 是 mongoose 里会用到的一种数据模式， 可以理解为表结构的定义；每个 schema 会映射到 mongodb 中的一个 collection，它不具备 操作数据库的能力

```js
const PageSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    slug:{
        type:String,
    },
    content:{
        type:String,
        required:true
    },
    sorting:{
        type:Number,
    },
  });
```

##### 3 创建数据模型

定义好了 Schema，接下就是生成 Model。model 是由 schema 生成的模型，可以对数据库的 操作。

```js
const Page = mongoose.model('page', PageSchema);
```

**注意：**

- `mongoose.model` 里面可以传入两个参数也可以传入三个参数
- `mongoose.model`（参数 1:模型名称，参数 2:Schema）
- `mongoose.model`（参数 1:模型名称，参数 2:Schema，参数 3:数据库集合名称）
- 如果传入 2 个参数的话，这个模型会和模型名称相同的复数的数据库建立连接：如通过下面 方法创建模型，那么这个模型将会操作 users 这个集合。

##### 4 查找数据

```js
UserModel.find({}, function(err, docs) {
  if (err) {
    console.log(err);
    return;
  }
  console.log(docs);
});

```

##### 5 增加数据

```js
//实例化模型 传入增加的数据
var u = new UserModel({
  name: "lisi2222",
  age: 20,
  status: true
});
u.save();
复制代码
```

##### 6 修改数据

```js
UserModel.updateOne({ name: "lisi2222" }, { name: "哈哈哈" }, function(err, res) {
  if (err) {
    console.log(err);
    return;
  }
  console.log("成功");
});
复制代码
```

##### 7 删除数据

```js
UserModel.deleteOne({ _id: "5b72ada84e284f0acc8d318a" }, function(err) {
  if (err) {
    console.log(err);
    return;
  } 
  //只会删除一条
  console.log("成功");
});
```




#### bcryptjs基本使用

`bcryptjs` 是nodejs中比较好的一款加盐(`salt`)加密的包, 我们处理密码加密、校验要使用到的两个方法：

```js
/**
 * 加密处理 - 同步方法
 * bcryptjs.hashSync(data, salt)
 *    - data  要加密的数据
 *    - slat  用于哈希密码的盐。如果指定为数字，则将使用指定的轮数生成盐并将其使用。推荐 10
 */
const hashPassword = bcryptjs.hashSync(password, 10)


/**
 * 校验 - 使用同步方法
 * bcryptjs.compareSync(data, encrypted)
 *    - data        要比较的数据, 使用登录时传递过来的密码
 *    - encrypted   要比较的数据, 使用从数据库中查询出来的加密过的密码
 */
const isOk = bcryptjs.compareSync(password, encryptPassword)
```



#### 路由介绍

路由（Routing）是由一个 URI（或者叫路径）和一个特定的 HTTP 方法（GET、POST 等）组成的，涉及到应用如何响应客户端对某个网站节点的访问。

每一个路由都可以有一个或者多个处理器函数，当匹配到路由时，这个/些函数将被执行



#### express-session

http://blog.inode.club/cookie-session-token305/

#### express-validator

https://juejin.cn/post/6844903854195081223



## 项目中遇到的问题

### 1 a标签的点击事件以及href跳转的问题

在项目中，我需要设计一个**删除**按钮（是一个a标签），点击后会弹出确认窗口，如果取消删除，则不发生任何操作。如果点击确定（删除），那么就会进行href的一个路由跳转。

a标签的click 事件是在页面开始跳转之前执行的。正常情况下，如果给a标签添加一个click点击事件，比如说执行一些打印操作，控制台会很快刷新一下的。因为a标签有默认的一个href跳转动作（默认事件），在执行完打印操作后，页面会很快跳转，这是控制台就已经被刷新了。

如果要阻止这个默认事件，可以使用e.preventDefalt()。

参考链接

- [HTML tag  want to add both href and onclick working](https://stackoverflow.com/questions/14867558/html-tag-a-want-to-add-both-href-and-onclick-working)

- [a 标签的 href 属性和 onclick 事件](http://www.xinxiaoyang.com/programming/2017-03-06-a-tag-with-onclick-event/)

### 2 mkdirp slower than fileupload

项目中使用mkdirp插件实现多层文件夹的操作，建完文件夹后，需要把图片保存在对应的文件夹中，但这时候我遇到了问题：**No such file or directory**，经观察，我发现创造文件更慢，以至于后面上传文件的时候，没有文件夹。这就是程序报错的原因：。

更重要的原因是mkdirp这个函数是异步的。因此，可以在异步执行完后返回的promise中使用then方法，继续下面的程序

```js
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
```

### 3 request.files获取不到文件的解决方案

在form表单中发送post请求的时候，需要给服务器一些图片，但是我在req.files上找不到。后来发现是我在form标签了，没有加上 enctype="multipart/form-data" 的属性。

要确保能在req.files上获取文件，要确保一些几点：

1. 保证页面中的上传文件标记里都包含name属性。

2. 必须在form上添加 enctype="multipart/form-data" 的属性。

这样后台就可以正常获取input type="file"提交过来的文件里。

### 4 管理台新添page,或者顺序改变，如果不重启服务器，用户主页不会更新

解决办法是在管理台的adminPages.js文件上，及时更改全局的pages变量，也就是*req*.app.locals.pages

```js
Page.find({}).sort({sorting:1}).exec(function(err,pages){
    if(err) console.log(err)
    // set global pages variable
    req.app.locals.pages = pages;
})
```

### 5 相对路径和绝对路径的问题

/product_images和product_images路径的区别，前者绝对路径（localhost:3000/product_images)，后者是相对路径(localhost:3000/当前路径/product_images) app.use('/当前路径')

```py
os.mkdir('dir_name') // 相对路径
os.mkdir('/dir_name') //绝对路径
```

### 6 [using findOne inside a foreach()](https://stackoverflow.com/questions/65538826/using-findone-inside-a-foreach)

由于mongoose数据查询是异步操作，所以如果我在for循环下查找数据库的话会出现问题。

这个问题出现的场景是，我想在用stripe结账的时候，从服务器上计算total总价格，因此我采用前端传过来的购买商品名字和数量这两个信息，去服务器里匹配对应的商品价格，然后计算total。但是我每次stripe接口结账的时候total为0，而stripe接口必须支付打印1cent以上的金额。所以就出现了程序报错。

查找了很多资料，有说下面的程序可以解决，但是我试了不可行。但这里我这个方法我还是想做个标记，因为我对异步不是理解得很透彻。

```
(async () => {
    for (const question of questionList) {
    await questionAction(question);
    }
})()
```

最后我找到了解决问题的思路，就是数据库接口的设计问题，一个数据库不止可以实现findOne查找，还有findAll查找。为什么要每次在for循环下findOne呢？这很明显不符合数据库接口的设计思路，多次访问数据库也会给服务器带来很多负担。

所以应该优化这个查询思路，就是一次性找出所有的数据，找出来后再进行计算。

```js
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
```

解决问题过程中查找的资料：

- [解决mongoose数据查询的异步操作](https://blog.csdn.net/blueblueskyhua/article/details/53783092)

- How to call a mongoose findOne inside the forEach before the answer?[](https://helperbyte.com/questions/438636/how-to-call-a-mongoose-findone-inside-the-foreach-before-the-answer)

[如何优雅的解决循环里的异步查询](http://www.hpnews.online/topic/57822a8aee5f048d54f9081b&auther=weapon-xx)？（主要是这个博客点醒了我！！！！）

### 7 [res.redirect is not a function in promise then](https://stackoverflow.com/questions/50427032/res-redirect-is-not-a-function-in-promise-then)

res.redirect cant work in then promise





## 项目未来的一些优化想法

1 采用懒加载的加载模式，大大提高了页面的加载速度，提高用户体验，降低了后台API请求数据的压力。

2 权限跳转 https://juejin.cn/post/6844904033660977159

3 jwt 方式，标识用户身份

服务器验证成功后应该签发一个身份标识的东西给客户端，这样以后客户端就拿着这个标识来证明自己的身份。而标识用户身份的方式有多种，这里我们采用`jwt`方式

https://juejin.cn/post/7044708915438682148

4 后台管理中，pages 编辑的内容。可以用一些插件修改文字的样式，比如 CKeditor



## 总结

这个项目大概做了8天。写博客也花了好几个小时。甚至中途都有点想为啥我要花这么久时间写博客，太费时间了。后来我想通了，我目前的学习不是很沉淀，我需要做笔记来加深我对前端知识的理解。所以我应该坚持。



最近比较忙碌的一段时间，本来想找实习的，但是来不及了，感觉没有准备好。还有这个月中旬由有教资面试（虽然我不打算当老师），但是我就是想拿到这个证，所以我就下定决心要花时间拿到。这个月还想开始联系博导，虽然我的最终目标是硕士毕业工作，做前端开发，但是我本科就有一些文章和成果，所以还是想看看这些东西能不能找个985博士读读。



最近几个月我还想复习我的光学专业知识，感觉专业上用的中文教材都不是很好，没讲清楚很多东西，所以我找一下国外教材重新复习一下。一下子这么多事情我感觉很烦躁，随便一项工作都要花时间，有些东西最对我来水可能以后还用不到，但是我一想到这点，我就觉得我不能这样想，我不能因为他有用而去学。相反，任何东西都很有用，我应该抱着热爱、兴趣的态度去学习。如果我要是不喜欢，那我才应该真正的放弃。





