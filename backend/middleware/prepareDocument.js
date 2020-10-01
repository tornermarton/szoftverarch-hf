function generateID() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}


module.exports = function (objectRepository) {
    return function (req, res, next) {
        // code comes here

        let id = generateID();
        
        while (id in Object.keys(req.session.documents)) {
            id = generateID()
        }

        req.session.documents[id] = {
            'link': req.body.link
        };

        return res.redirect('/edit/'+id);
    };

};