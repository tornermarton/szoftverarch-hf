module.exports = function (objectRepository) {
    return function (req, res, next) {
        const document = res.locals.document;

        if (document.owner === req.session.user.uid) {
            return next();
        }
        else {
            const error = new Error("Unauthorized access.");

            error.status = 403;

            return next(error);
        }
    };
};