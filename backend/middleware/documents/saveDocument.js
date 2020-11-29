const cheerio = require('cheerio');
const fs = require('fs');

module.exports = function (objectRepository) {
    return function (req, res, next) {
        const path = '/uploads/doc_'+res.locals.document._id+'/uncompressed/compiled_output/main.html';

        const text = req.body.document_html;
        const $ = cheerio.load(text);

        $(".editable-div").attr("contenteditable", "false");

        $("*[data-external='true']").remove();

        $('img').each(function() {
            const old_src = $(this).attr('data-old-src');
            $(this).attr('src', old_src);
        });

        $('link:not([data-fix-resource])').each(function () {
            const old_href = $(this).attr('data-old-href');
            $(this).attr('href', old_href);
        });

        fs.writeFileSync(path, $.html());

        return res.json({"success": true}).end();
    };

};