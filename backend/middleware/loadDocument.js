module.exports = function (objectRepository) {

    return function (req, res, next) {
        // code comes here

        const document = req.session.documents[req.params.id];

        if (document === undefined) {
            let err = new Error('Cannot find document ' + req.params.id);
            err.status = 404;
            return next(err);
        }

        res.tpl.link = document.link;

        return next();
    };

};