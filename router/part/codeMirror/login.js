let express = require('express');
let router = express.Router();
let getCollection = require('../../../mongo/getDbCodeMirror');
const dbApi = require('../../../util/mongoApi');

let userC = getCollection('user');
router.post('/add', async (req, res) => {
    try {
        let body = req.body;
        if (body.code !== 'kaikai') {
            throw new Error('邀请码错误');
            return;
        }
        let dbResult = await dbApi.find(userC, {account: body.account});
        if(!dbResult || dbResult.length === 0) {
            await dbApi.insert(userC, {account: body.account, password: body.password});
            res.json({
                code: '0',
                msg: '添加成功',
                data: null
            })
        } else {
            throw new Error('该用户已存在');
        }

    } catch(err) {
        let errMsg = '';
        if (typeof err === 'string') {
            errMsg = err;
        } else {
            errMsg = err.message;
        }
        res.json({
            code: '500',
            msg: errMsg,
            data: null
        });
    }

});

router.post('/login', async (req, res) => {
    try {
        let body = req.body;
        let dbResult = await dbApi.find(userC, {account: body.account, password: body.password});
        if(!dbResult || dbResult.length === 0) {
            res.json({
                code: '500',
                msg: '用户名和密码不匹配',
                data: null
            })
        } else {
            res.json({
                code: '0',
                msg: '登录成功',
                data: null
            });
        }

    } catch(err) {
        let errMsg = '';
        if (typeof err === 'string') {
            errMsg = err;
        } else {
            errMsg = err.message;
        }
        res.json({
            code: '500',
            msg: errMsg,
            data: null
        });
    }
});

module.exports = router;
