var express = require('express');
var router = express.Router();

var db = require("../config/db");
const Unity = require('../unity/Unity');//Unity为一个工具类
const r = Unity.send;

/**
 * search
 */
router.get('/', function(req, res, next) {
    db.query("select * from city",function (error, rows) {
        if (error) {
            res.send(r('', 200, 1, 'error'));
        } else {
            res.send(r(rows));
        }
    })
});
module.exports = router;//不加这句会报错： Router.use() requires a middleware function but got a Object （没有向外暴露，导致app.use引用不到）