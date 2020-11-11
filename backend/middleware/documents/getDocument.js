const requireOption = require('../common').requireOption;

module.exports = function (objectRepository) {

    const DocumentModel = requireOption(objectRepository, 'documentModel');

    return function (req, res, next) {

        DocumentModel.findById(req.params.id, function (err, doc) {
            if (err) {
                return next(err);
            }

            if (doc) {
                res.tpl.document = doc;

                return next();
            }

            err = new Error('Cannot find document ' + req.params.id);
            err.status = 404;

            return next(err);
        });
    };

};