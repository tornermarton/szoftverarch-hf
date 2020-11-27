const cheerio = require('cheerio');
const fs = require('fs');

module.exports = function (objectRepository) {
    return function (req, res, next) {
        fs.readFile('/uploads/doc_'+res.tpl.document._id+'/uncompressed/compiled_output/main.html', 'utf8', (err, text) => {
            text = text.replace(/commentedsectionstart/g, "<span class='commented'>");
            text = text.replace(/commentedsectionend/g, "</span>");

            const $ = cheerio.load(text);

            $('img').each(function() {
                const old_src = $(this).attr('src');
                const new_src = '/doc_' + res.tpl.document._id + '/uncompressed/compiled_output/' + old_src;
                $(this).attr('src', new_src);
            });

            $('link').each(function () {
                const old_href = $(this).attr('href');
                const new_href = '/doc_' + res.tpl.document._id + '/uncompressed/compiled_output/' + old_href;
                $(this).attr('href', new_href);
            });

            $('body>p, figure, table').each(function () {
                let $section$ = cheerio.load(
                    '<div class="document-section"><div class="document-section-wrapper"><div class="document-section-before"></div><div class="document-section-content"></div><div class="document-section-comment" style="display: none"><textarea></textarea></div></div></div>'
                );
                let node = $(this).clone();
                $section$(".document-section-content").append(node);
                $(this).replaceWith($section$.html());
                console.log("asd");
            });

            let $editor$ = cheerio.load(
            '<div class="editor-menu" id="editor-menu">' +
                '<div class="editor-menu-content">' +
                    '<div class="editor-menu-element">' +
                        '<div class="editor-menu-element-inner">' +
                            '<div class="editor-menu-mark">' +
                'mark' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="editor-menu-element">' +
                        '<div class="editor-menu-element-inner">' +
                            '<div class="editor-menu-comment">' +
                'comment' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="editor-menu-element">' +
                        '<div class="editor-menu-element-inner">' +
                            '<div class="editor-menu-hide">' +
                'hide' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>'
            );

            $('body').append($editor$.html());

            let head = $('head').html();
            let body = $('body').html();

            res.tpl.head = head;
            res.tpl.body = body;

            return next();
        });
    };

};