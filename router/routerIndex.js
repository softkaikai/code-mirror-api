let login = require('./part/login');
let book = require('./part/book');
let codeMirrorLogin = require('./part/codeMirror/login');
let codeMirrorTeam = require('./part/codeMirror/team');
let codeMirrorDoc = require('./part/codeMirror/doc');

module.exports = function(app) {
    app.all('*', (req, res, next) => {
        res.set({
            'Access-Control-Allow-Origin': '*'
        });
        next();
    });
    app.use('/login', login);
    app.use('/book', book);
    app.use('/codeMirrorLogin', codeMirrorLogin);
    app.use('/codeMirrorTeam', codeMirrorTeam);
    app.use('/codeMirrorDoc', codeMirrorDoc);
};

