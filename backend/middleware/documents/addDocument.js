const fs = require('fs');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const requireOption = require('../common').requireOption;

module.exports = function (objectRepository) {

    const DocumentModel = requireOption(objectRepository, 'documentModel');

    return function (req, res, next) {
        const newDocument = new DocumentModel();
        const err_message = "Invalid URL.";

        newDocument.owner = req.session.user.uid;
        newDocument.title = req.body.title;

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

            fetch("https://arxiv.org/abs/"+ newDocument.arxiv_id + "/").then(function (response) {
                if (response.ok) {
                    fetch(
                        "http://compiler:5000/process_all?arxiv_id=" + newDocument.arxiv_id + "&generated_id=" + newDocument._id
                    ).then(function (response) {
                        if (response.ok) {
                            newDocument.save(function (err) {
                                if (err) {
                                    return next(err);
                                }

                                const path = '/uploads/doc_'+newDocument._id+'/uncompressed/compiled_output/main.html';

                                fs.readFile(path, 'utf8', (err, text) => {
                                    // text = text.replace(/<p[\r\n\s]*class="indent"[\r\n\s]*>[\r\n\s]*commentedsectionstart/g, "<p class='indent commented'>");
                                    // text = text.replace(/<p[\r\n\s]*class="noindent"[\r\n\s]*>[\r\n\s]*commentedsectionstart/g, "<p class='noindent commented'>");
                                    // text = text.replace(/commentedsectionend[\r\n\s]*<[\r\n\s]*\/p[\r\n\s]*>/g, "</p>");

                                    text = text.replace(/commentedsectionstart/g, "</p><p class='indent commented'>");
                                    text = text.replace(/commentedsectionend/g, "</p><p class='indent'>");

                                    const $ = cheerio.load(text);

                                    $("body>p").each(function () {
                                        if ($(this).text().trim() === "") {
                                            $(this).remove();
                                        }
                                    });

                                    $('body>p, figure, table').each(function () {
                                        let $section$ = cheerio.load(
                                            '<div class="document-section">' +
                                                '<div class="document-section-wrapper">' +
                                                    '<div class="document-section-before"></div>' +
                                                    '<div class="document-section-content"></div>' +
                                                    '<div class="document-section-comment" style="display: none">' +
                                                        '<div class="editable-div" onfocus="textarea_on_input(this)" oninput="textarea_on_input(this)" onfocusout="textarea_on_focusout(this)"></div>' +
                                                    '</div>' +
                                                '</div>' +
                                            '</div>'
                                        );
                                        let node = $(this).clone();
                                        $section$(".document-section-content").append(node);
                                        $(this).replaceWith($section$.html());
                                    });

                                    fs.writeFileSync(path, $.html());

                                    return res.redirect('/documents/' + newDocument._id + '/edit/');
                                });
                            });
                        }
                        else {
                            return next(new Error("Compilation failed, the requested ArXiV document is not supported. :("));
                        }
                    });
                }
                else {
                    return next(new Error("The requested ArXiV document is not found."));
                }
            });
        } catch (err) {
            console.log(err);
            return next(err); // => TypeError, "Failed to construct URL: Invalid URL"
        }
    };

};