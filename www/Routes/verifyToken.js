var jwt = require('jsonwebtoken');
const db = require('../../scripts/dbConnection');

function verifyToken(req, res, next) {
    if (
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer') ||
        !req.headers.authorization.split(' ')[1]
    ) {
        return res.status(422).json({
            message: "Please provide the token",
        });
    }
    const theToken = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(theToken, 'the-super-strong-secrect');

    db.query('SELECT * FROM users where userId=?', decoded.id, function (error, results, fields) {
        if (error) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }else {
            // if everything good, save to request for use in other routes
            req.userId = decoded.id;
            //return res.send({ error: false, data: results[0], message: 'Fetch Successfully.' });
            next();
        }
        
    });
}
module.exports = verifyToken;