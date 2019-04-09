# react+koa+mongodb+redis 个人技术博客
## 说明:
+   借鉴项目:[React-Express-Blog-Demo](https://github.com/Nealyang/React-Express-Blog-Demo),基础比较弱的可以先看下这个项目，说的比较详细，由于比较偏后端，所以前端这块改动的不多，主要是后端的一些改动，后面会依次贴出代码改动以及所遇到的一些问题跟解决方案

## 改动基本介绍，相关代码会贴出来并主要说一下:
* [前端](#前端):
    * [增加了后台管理评论功能,主要有评论审核,开启审核](#前端后台评论管理功能)
    * [增加了github第三方登录功能](#前端第三方github登录功能)
    * [给文章增加了评论功能,用户可以发表评论以及给评论进行点赞](#前端文章评论功能)
* [后端](#后端):
    * [后端由express改成了koa以及相应的中间件的改变](#后端框架修改)
    * [加入了token+session认证机制](#token+session功能)
    * [数据库这块做了一些字段的改动以及增加了评论点赞表跟评论表](#后端数据库字段更改跟表添加)
    * [增加了单元测试以及代码风格检查](#单元测试以及代码检查)
    * [增加了log模块，可以实现具体文件名以及行号提示](#log模块)
    
## 项目结构介绍，只涉及后端，前端基本没啥改动，不懂得可以看下我借鉴的项目
- [项目结构地址](https://github.com/oyosc/blog/blob/master/record/doc/%E9%A1%B9%E7%9B%AE%E7%BB%93%E6%9E%84%E4%BB%8B%E7%BB%8D.md)
## api接口整理
- [api接口地址](https://github.com/oyosc/blog/blob/master/record/doc/api_%E6%96%87%E6%A1%A3%E8%AF%B4%E6%98%8E.md)
## 前端
### 前端后台评论管理功能
- 这里跟别的文章管理没什么区别，主要的问题就在于columns这个数组对象需要放在组件里，否则无法获取this对象以及对应的props，另外antd库，在使用
   switch组件的时候defaultChecked在面对Pagination换页时会出现状态无法更改，还是显示上一页的状态，这里需要使用checked属性，[具体代码以及说明](https://github.com/oyosc/blog/blob/master/record/doc/%E5%89%8D%E7%AB%AF%E5%90%8E%E5%8F%B0%E8%AF%84%E8%AE%BA%E7%AE%A1%E7%90%86%E5%8A%9F%E8%83%BD.md)
   
### 前端第三方github登录功能
- github第三方登录在react上这种单页面实现的时候，会出现跨域问题，这里的话有两种解决办法，[具体代码以及解决办法](https://github.com/oyosc/blog/blob/master/record/doc/github%E7%AC%AC%E4%B8%89%E6%96%B9%E7%99%BB%E5%BD%95%E5%8A%9F%E8%83%BD.md)

### 前端文章评论功能
- 这块是通过我上文所借鉴项目里的教程开发的，样式的话是采用github的issue结构，具体代码位于blog/app/containers/comment文件夹里，这里就不细说了，唯一需要注意的就是在评论或者点赞的时候需要更新react state

## 后端
### 后端框架修改
- 将框架由express改成了koa2，具体的中间件的话可以查看blog/server/api/apiServer.js

### token+session功能
- 在后台中间件这里新增了token中间件(检测token)跟admin中间件(检测是否为admin),这里token中间件的处理流程是先检测请求路径是否需要验证token,如果需要则检测其请求头上的authorization字段,满足的话进入路由，并且在结束后在其响应头上将token值添加到Authorization字段，这里如果前后端采用不同的端口会产生跨域问题，[具体代码以及解决方案](https://github.com/oyosc/blog/blob/master/record/doc/token%2Bsession%E5%8A%9F%E8%83%BD.md)

### 后端数据库字段更改跟表添加
- 这里就一些表字段更改就表添加，唯一需要注意的是mongoose.model这个方法在表名没有s的时候会自动加上,另外使用了mongodb的aggregate,pipeline等，[具体代码以及方案](https://github.com/oyosc/blog/blob/master/record/doc/%E5%90%8E%E7%AB%AF%E6%95%B0%E6%8D%AE%E5%BA%93%E5%AD%97%E6%AE%B5%E6%9B%B4%E6%94%B9%E8%B7%9F%E8%A1%A8%E6%B7%BB%E5%8A%A0.md)

### 单元测试以及代码检查
- 单元测试这里用的是jest，原因的话主要由于它内嵌了断言等，并且支持react，代码位于blog/test文件夹，目前只写了登录的测试接口，后面有时间再加上，代码检查的话采用的是eslint库，extends standard，后面加了一些自己的规则

### log模块
- 这里在网上其实有别的方式来定义一个全局的错误变量，但是很可惜的是在es5里已经不再支持，这里我采用的是定义一个全局函数，当调用它的时候会产生一个错误，再通过正则来获取所在的代码行号跟文件信息，[具体代码](https://github.com/oyosc/blog/blob/master/record/doc/log%E6%A8%A1%E5%9D%97.md)

## 环境
```
react @16.3.1
react-router @4.2.0
node @8.9.1
mongodb @4.0.2
webpack @4.4.1
```
## 运行
   git clone https://github.com/oyosc/blog
   
   npm install
   
   npm run start-prod
   
## 独立打包
   npm run build
   
## pm2方式启动
   npm install pm2 -g
   
   pm2 -i max start npm -- run start-prod-debug(这里的命令可以查看package.json文件)
   
## 开发数据库文件

> 地址: https://pan.baidu.com/s/1oLyvpJ3gwcgvTmSAjn9OJA 密码: bv1c

## 从零开始搭建项目
   [感兴趣的请移步我的博客](http://www.bokes.wang/detail/5b86626dc8907a08e4ca2a1c)
   
## TODO
- 后面有时间打算把推送也实现下，至于其他的再看吧

## UPDATE
- 增加github同步功能，博客会定时的对github上特定的issue进行同步以及更新 -- 2019.4.9
   
## more
-   由于一直是做后端程序员，所以搞起前端来感觉很麻烦，有问题什么的请提issue,有时间的话会回答的，最后欢迎star,欢迎fork,大家一起学习
