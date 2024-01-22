const jsonwebtoken = require('jsonwebtoken');
const { promisify } = require('util');

const jwt = {
    sigh: promisify(jsonwebtoken.sign),
    verify: promisify(jsonwebtoken.verify)
};

module.exports = jwt;