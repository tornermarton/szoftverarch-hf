const cheerio = require('cheerio');
const fs = require('fs');

module.exports = function (objectRepository) {
    return function (req, res, next) {
        fs.readFile('/uploads/doc_'+res.locals.document._id+'/uncompressed/compiled_output/main.html', 'utf8', (err, text) => {
            const $ = cheerio.load(text);

            if (res.locals.mode === "edit") {
                $(".editable-div").attr("contenteditable", "true");
            }

            $('img').each(function() {
                const old_src = $(this).attr('src');
                const new_src = '/doc_' + res.locals.document._id + '/uncompressed/compiled_output/' + old_src;
                $(this).attr('src', new_src);
                $(this).attr('data-old-src', old_src);
            });

            $('link:not([data-fix-resource])').each(function () {
                const old_href = $(this).attr('href');
                const new_href = '/doc_' + res.locals.document._id + '/uncompressed/compiled_output/' + old_href;
                $(this).attr('href', new_href);
                $(this).attr('data-old-href', old_href);
            });

            let head = $('head').html();
            let body = $('body').html();

            res.locals.head = head;
            res.locals.body = body;

            return next();
        });
    };

};