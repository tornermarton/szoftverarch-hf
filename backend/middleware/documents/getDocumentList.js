const requireOption = require('../common').requireOption;

module.exports = function (objectRepository) {

    const DocumentModel = requireOption(objectRepository, 'documentModel');

    return function (req, res, next) {

        DocumentModel.find({ owner: req.session.user.uid}, function (err, docs) {
            if (err) {
                return next(err);
            }

            if (!Array.isArray(docs)) {
                docs = [docs];
            }

            res.locals.documentList = docs;

            return next();
        });
    };

};