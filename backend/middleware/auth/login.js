/**
 *  MIDDLEWARE
 *  Verify the firebase token sent in the request.
 *  If correct sign in user.
 */
const admin = require('firebase-admin');

module.exports = function (objectRepository) {

    return function (req, res, next) {//Parameter check
        if ((typeof req.body === 'undefined') ||
            (typeof req.body.token === 'undefined')) {
            return next(new Error('Token is undefined!'));
        }

        admin.auth().verifyIdToken(req.body.token)
            .then(decodedToken => req.session.user = decodedToken)
            .then(() => res.json({ success: true }))
            .catch(() => res.json({ success: false }));
    };

};
