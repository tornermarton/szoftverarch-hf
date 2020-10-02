const uid = require('uid');


module.exports = function (objectRepository) {
    return function (req, res, next) {
        // code comes here

        let guid = uid(12);

        req.session.documents[guid] = {
            'guid': guid,
            'link': req.body.link
        };

        return res.redirect('/edit/'+guid);
    };

};