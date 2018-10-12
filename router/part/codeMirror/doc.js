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
        await dbApi.update(teamC, {_id: toId(body.id)}, {'$push': {docs: body.doc}});
        res.json({
            code: '0',
            msg: '添加成功',
            data: null
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


module.exports = router;
