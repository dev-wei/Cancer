var path = require('path'),
    rootPath = path.normalize(__dirname + '/../..');

module.exports = {
    env: process.env.NODE_ENV,
    root: rootPath,
    port: process.env.PORT || 3000,
    db: process.env.MONGOHQ_URL
};
