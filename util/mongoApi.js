module.exports = {
    find (collection, body) {
        return new Promise((resolve, reject) => {
            collection.find(body).toArray((err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }

            })
        })
    },
    insert (collection, body) {
        return new Promise((resolve, reject) => {
            collection.insert(body, (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    }
};