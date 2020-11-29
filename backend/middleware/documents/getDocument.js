const requireOption = require('../common').requireOption;

module.exports = function (objectRepository) {

    const DocumentModel = requireOption(objectRepository, 'documentModel');

    return function (req, res, next) {

        DocumentModel.findById(req.params.id, function (err, doc) {
            if (err) {
                return next(err);
            }

            if (doc) {
                res.locals.document = doc;

                return next();
            }

            const error = new Error('Cannot find document ' + req.params.id);
            error.status = 404;

            return next(error);
        });
    };

};