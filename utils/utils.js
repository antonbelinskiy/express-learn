
async function performQuery(query, pool) {
    return await new Promise(  function (resolve, reject) {
        pool.query(query, function (err, res) {
            if (err) reject(err);
            else resolve(res.rows);
        });
    });
}

module.exports = performQuery;

