let express = require('express');
let router = express.Router();
let getCollection = require('../../../mongo/getDbCodeMirror');
const dbApi = require('../../../util/mongoApi');

let teamC = getCollection('team');
router.post('/add', async (req, res) => {
    try {
        let body = req.body;
        let dbResult = await dbApi.find(teamC, body);
        if(!dbResult || dbResult.length === 0) {
            await dbApi.insert(teamC, {...body, member: [body.account]});
            res.json({
                code: '0',
                msg: '添加成功',
                data: null
            })
        } else {
            throw new Error('该team已存在');
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

router.get('/find', async (req, res) => {
    try {
        let body = req.query;
        let search = {
            account: body.account,
        };
        if (body.name) {
            search.name = {$regex: `.*(${body.name}).*`};
        }
        let dbResult = await dbApi.find(teamC, search);
        res.json({
            code: '0',
            msg: '',
            data: dbResult
        })

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
        let dbResult = await dbApi.find(teamC, {account: body.account, password: body.password});
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
