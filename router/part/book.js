let express = require('express');

let router = express.Router();
let getCollection = require('../../mongo/getDb');

let bookC = getCollection('book');
let borrowBook = getCollection('borrowBook');

let getCurrentTime = function(dateFormat) {
    var date = new Date();
    if(dateFormat) {
        date = dateFormat;
    }
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var hours = date.getHours();
    var mins = date.getMinutes();
    var secs = date.getSeconds();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (hours >= 0 && hours <= 9) {
        hours = "0" + hours;
    }
    if (mins >= 0 && mins <= 9) {
        mins = "0" + mins;
    }
    if (secs >= 0 && secs <= 9) {
        secs = "0" + secs;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + hours + seperator2 + mins
        + seperator2 + secs;
    return currentdate;

};

router.get('/getAll', (req, res) => {
    bookC.find({}, (err, results) => {
        if(err) {
            res.json({
                code: '222',
                msg: '不知名错误',
                data: null
            })
        } else {
            let data = [];
            results.each((errT, result) => {
                if(errT) {
                    res.json({
                        code: '222',
                        msg: '不知名错误',
                        data: null
                    })
                } else {
                    if(result == null) {
                        res.json({
                            code: '0',
                            msg: '',
                            data: data
                        })
                    } else {
                        if(result.canBorrowNum) {
                            data.push(result);
                        }
                    }
                }
            });
        }
    })
});

router.post('/add', (req, res) => {
    let body = req.body;
    bookC.find({name: body.name}).toArray((err, result) => {
        if(err) {
            res.json({
                code: '222',
                msg: '不知名错误',
                data: null
            });
        } else {
            if(!result || result.length === 0) {
                body.canBorrowNum = body.num;
                bookC.insert(body);
                res.json({
                    code: '0',
                    msg: '添加成功',
                    data: null
                })
            } else {
                res.json({
                    code: '111',
                    msg: '该书名已存在',
                    data: null
                });
            }
        }
    })
});

router.post('/remove', (req, res) => {
    let body = req.body;
    borrowBook.find({name: body.name}).toArray((err1, result1) => {
        if(err1) {
            res.json({
                code: '222',
                msg: '不知名错误',
                data: null
            });
            return;
        }
        if(result1&&result1.length) {
            res.json({
                code: '333',
                msg: '该书有借出去的，不能删除',
                data: null
            });
            return;
        }
        bookC.remove({name: body.name}, (err, result) => {
            if(err) {
                res.json({
                    code: '222',
                    msg: '不知名错误',
                    data: null
                });
            } else {
                res.json({
                    code: '0',
                    msg: '删除成功',
                    data: null
                });
            }
        })
    })

});

router.post('/borrow', (req, res) => {
    let body = req.body;
    console.log(body);
    borrowBook.find({name: body.name, account: body.account}).toArray((err1, result1) => {
        if(err1) {
            res.json({
                code: '222',
                msg: '不知名错误',
                data: null
            });
            return;
        }
        if(result1&&result1.length) {
            res.json({
                code: '333',
                msg: '你已经借阅了该书籍',
                data: null
            });
            return;
        } else {
            bookC.find({name: body.name}, (err, result) => {
                if(err) {
                    res.json({
                        code: '222',
                        msg: '不知名错误',
                        data: null
                    });
                } else {
                    result.each((eachErr, val) => {
                        if(eachErr) {
                            res.json({
                                code: '222',
                                msg: '不知名错误',
                                data: null
                            });
                        }
                        if(val) {
                            if(val.canBorrowNum) {
                                bookC.update({name: body.name}, {$set: {canBorrowNum: val.canBorrowNum - 1}});
                                val.borrowTime = getCurrentTime();
                                val.account = body.account;
                                delete val._id;
                                borrowBook.insert(val);
                            }
                        } else {
                            res.json({
                                code: '0',
                                msg: '借用成功',
                                data: null
                            });
                        }
                    });
                }
            })
        }
    })
});

router.post('/returnBook', (req, res) => {
    let body = req.body;
    borrowBook.remove(body);
    bookC.find({name: body.name}).toArray((err, result) => {
        if(err) {
            res.json({
                code: '222',
                msg: '不知名错误',
                data: null
            })
            return;
        }
        bookC.update({name: body.name}, {$set: {canBorrowNum: parseInt(result[0].canBorrowNum) + 1}}, () => {
            res.json({
                code: '0',
                msg: '归还成功',
                data: null
            })
            return;
        });
    })

});

router.get('/getBorrow', (req, res) => {
    let query = req.query;
    borrowBook.find({account: query.account}, (err, results) => {
        if(err) {
            res.json({
                code: '222',
                msg: '不知名错误',
                data: null
            })
        } else {
            let data = [];
            results.each((errT, result) => {
                if(errT) {
                    res.json({
                        code: '222',
                        msg: '不知名错误',
                        data: null
                    })
                } else {
                    if(result == null) {
                        res.json({
                            code: '0',
                            msg: '',
                            data: data
                        })
                    } else {
                        data.push(result);
                    }
                }
            });
        }
    })
});


module.exports = router;
