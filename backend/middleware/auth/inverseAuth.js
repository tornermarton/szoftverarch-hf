/**
 * MIDDLEWARE
 * If the user is logged in, redirects to /
 */

module.exports = function (objectRepository) {

    return function (req, res, next) {
        if (typeof req.session.user !== 'undefined') {
            return res.redirect('/');
        }
        return next();
    };

};
