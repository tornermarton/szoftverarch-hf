const fs = require('fs');
const requireOption = require('../common').requireOption;

module.exports = function (objectRepository) {

    const DocumentModel = requireOption(objectRepository, 'documentModel');

    return function (req, res, next) {

        DocumentModel.findByIdAndRemove(req.params.id, function (err, doc) {
            if (err) {
                return next(err);
            }

            if (!doc) {
                const error = new Error('Cannot find document ' + req.params.id);
                error.status = 404;

                return next(error);
            }

            const path = '/uploads/doc_'+doc._id+'/';

            fs.rmdirSync(path, { recursive: true });

            return res.json({success: true}).end();
        });
    };

};