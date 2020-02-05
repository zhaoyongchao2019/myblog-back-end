var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var jwt = require('jsonwebtoken')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);


// 模拟一个登陆的接口
app.post('/login',function(req,res){
    let userlist = {user:'qiaoqiao',password:'15819745146zyc'}
    console.log(req.body.user)
    console.log(req.body.password)
    if(userlist.user == req.body.user && userlist.password == req.body.password){
        // 登录成功获取用户名
        let username = req.body.user
        res.json({
            // 进行加密的方法
            // sing 参数一：加密的对象 参数二：加密的规则 参数三：对象
            token:jwt.sign({username:username},'abcd',{
                // 过期时间
                expiresIn:"1h"
            }),
            username,
            code:200
        })
    }
    else{
        res.json({data:'登录失败'})
    }
})

// 登录持久化验证接口 访问这个接口的时候 一定要访问token（前端页面每切换一次，就访问一下这个接口，问一下我有没有登录/登陆过期）
// 先访问登录接口，得到token，在访问这个，看是否成功
app.post('/validate',function(req,res){
  let token = req.headers.authorization;
  // 验证token合法性 对token进行解码
  jwt.verify(token,'abcd',function(err,decode){
      if(err){
          res.json({
              msg:'当前用户未登录'
          })
      }else {
          // 证明用户已经登录
          res.json({
              token:jwt.sign({username:decode.username},'abcd',{
                  // 过期时间
                  expiresIn:"1h"
              }),
              username:decode.username,
              msg:'已登录'
          })
      }
  })
})


module.exports = app;
