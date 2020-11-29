/**
 * MIDDLEWARE
 * Destroy the session in case of logout
 */

module.exports = function (objectRepository) {
    return function (req, res, next) {
        req.session.destroy(function (err) {
            if (err) {
                console.log("Error destroying session");
                return res.redirect('/');
            } else {
                console.log("Session destroyed successfully");
                return res.redirect('/');
            }
        });
    };

};
