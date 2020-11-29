/**
 * MIDDLEWARE
 * Using the template engine render the values into the template
 */

module.exports = function (objectRepository, viewName) {

    return function (req, res) {
        //The res.locals can be dressed up here

        res.locals.title = res.locals.title || "ArXiView";

        if (req.session.user) {
            res.locals.user = {
                "name": req.session.user.name
            };
        }

        res.render(viewName);
    };

};
