let express = require('express');
let router = express.Router();
let getCollection = require('../../mongo/getDb');

let userC = getCollection('user');

router.post('/add', (req, res) => {
    let body = req.body;
    userC.find(body).toArray((err, result) => {
        if(err) {
            console.log(err);
            res.json({
                code: '222',
                msg: '不知名错误',
                data: null
            });
        } else {
            if(!result || result.length === 0) {
                userC.insert(body);
                res.json({
                    code: '0',
                    msg: '添加成功',
                    data: null
                })
            } else {
                res.json({
                    code: '111',
                    msg: '该用户已存在',
                    data: null
                });
            }
        }
    });
});

router.post('/in', (req, res) => {
    let body = req.body;
    userC.find(body).toArray((err, result) => {
        if(err) {
            console.log(err);
            res.json({
                code: '222',
                msg: '不知名错误',
                data: null
            });
        } else {
            if(!result || result.length === 0) {
                res.json({
                    code: '111',
                    msg: '该用户不存在',
                    data: null
                })
            } else {
                res.json({
                    code: '0',
                    msg: '登录成功',
                    data: result
                });
            }
        }
    });
});

module.exports = router;
