var crypto = require('crypto');
var mysalt = "meaningless_words";

module.exports = (password) => {
    return crypto.createHash('sha512').update(password + mysalt).digest('base64');
}