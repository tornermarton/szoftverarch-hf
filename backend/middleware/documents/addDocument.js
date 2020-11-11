const fs = require('fs');
const requireOption = require('../common').requireOption;

module.exports = function (objectRepository) {

    const DocumentModel = requireOption(objectRepository, 'documentModel');

    return function (req, res, next) {
        const newDocument = new DocumentModel();
        const err_message = "Invalid URL.";

        try {
            const url = new URL(req.body.link);
            const path_array = url.pathname.split("/");

            if (url.hostname !== "arxiv.org") {
                throw err_message;
            }

            if (path_array[1] === "abs") {
                newDocument.arxiv_id = path_array[2]
            }
            else if (path_array[1] === "pdf") {
                newDocument.arxiv_id = path_array[2].substr(0, path_array[2].length - 4);
            }
            else {
                throw err_message;
            }

            newDocument.save(function (err) {
                console.log(newDocument._id);
                console.log(newDocument.arxiv_id);
                if (err) {
                    return next(err);
                }

                const path = '/uploads/doc_' + newDocument._id;

                if (fs.existsSync(path)) {
                    return next(new Error('Directory already exists!'));
                }

                fs.mkdirSync(path);

                return res.redirect('/' + newDocument._id + '/edit/');
            });
        } catch (err) {
            console.log(err);
            return next(err); // => TypeError, "Failed to construct URL: Invalid URL"
        }
    };

};