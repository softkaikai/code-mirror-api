const mongo = require('mongoskin');
let db = null;


module.exports = function(collection) {
    if(!db) {
        db = mongo.db('mongodb://localhost:27017/codeMirror', {native_parser: true});
    }
    return db.collection(collection);
};
