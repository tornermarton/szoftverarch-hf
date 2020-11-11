const cheerio = require('cheerio');
const fs = require('fs');

module.exports = function (objectRepository) {
    return function (req, res, next) {
        fs.readFile('/uploads/doc_'+res.tpl.document._id+'/main.html', 'utf8', (err, text) => {
            const $ = cheerio.load(text);

            $('img').each(function() {
                const old_src = $(this).attr('src');
                const new_src = '/doc_' + res.tpl.document._id + '/' + old_src;
                $(this).attr('src', new_src);
            });

            $('link').each(function () {
                const old_href = $(this).attr('href');
                const new_href = '/doc_' + res.tpl.document._id + '/' + old_href;
                $(this).attr('href', new_href);
            });

            let head = $('head').html();
            let body = $('body').html();

            res.tpl.head = head;
            res.tpl.body = body;

            return next();
        });
    };

};