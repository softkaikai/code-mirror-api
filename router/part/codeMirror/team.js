let express = require('express');
let router = express.Router();
let getCollection = require('../../../mongo/getDbCodeMirror');
const dbApi = require('../../../util/mongoApi');
const mongoSkin = require('mongoskin');

const toId = mongoSkin.ObjectID.createFromHexString;

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
        // 自己的team
        let searchOwn = {...search};
        // 自己加入的team
        let searchJoin = {...search, member: body.account, account: {$ne: body.account}};
        // 自己未加入的
        let searchForeign = {...search, member: {$nin: [body.account]}, account: {$ne: body.account}};
        let dbResult = await Promise.all([dbApi.find(teamC, searchOwn),dbApi.find(teamC, searchJoin),dbApi.find(teamC, searchForeign)]);
        res.json({
            code: '0',
            msg: '',
            data: {
                searchOwn: dbResult[0],
                searchJoin: dbResult[1],
                searchForeign: dbResult[2],
            }
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

router.get('/findById', async (req, res) => {
    try {
        let body = req.query;

        let dbResult = await dbApi.find(teamC, {'_id': toId(body.id)});
        res.json({
            code: '0',
            msg: '',
            data: dbResult[0]
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

router.post('/delete', async (req, res) => {
    try {
        let body = req.body;
        await dbApi.remove(teamC, {'_id': toId(body.id)});
        res.json({
            code: '0',
            msg: '删除成功',
            data: null
        });

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


router.post('/addTeam', async (req, res) => {
    try {
        let body = req.body;
        await dbApi.update(teamC, {'_id': toId(body.id)}, {'$push':{member: body.account}});
        res.json({
            code: '0',
            msg: '添加成功',
            data: null
        });

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

router.post('/deleteTeam', async (req, res) => {
    try {
        let body = req.body;
        await dbApi.update(teamC, {'_id': toId(body.id)}, {'$pull':{member: body.account}});
        res.json({
            code: '0',
            msg: '删除成功',
            data: null
        });

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
