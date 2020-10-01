/**
 * MIDDLEWARE
 * Using the template engine render the values into the template
 */

module.exports = function (objectRepository, viewName) {

    return function (req, res) {
        //The res.tpl can be dressed up here

        res.tpl.title = res.tpl.title || "ArXiView";

        res.render(viewName, res.tpl);
    };

};
