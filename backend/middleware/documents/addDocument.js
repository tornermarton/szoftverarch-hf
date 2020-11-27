const fs = require('fs');
const fetch = require('node-fetch');
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

            fetch("https://arxiv.org/abs/"+ newDocument.arxiv_id + "/").then(function (response) {
                if (response.ok) {
                    fetch(
                        "http://compiler:5000/process_all?arxiv_id=" + newDocument.arxiv_id + "&generated_id=" + newDocument._id
                    ).then(function (response) {
                        if (response.ok) {
                            newDocument.save(function (err) {
                                console.log(newDocument._id);
                                console.log(newDocument.arxiv_id);
                                if (err) {
                                    return next(err);
                                }

                                const path = '/uploads/doc_'+res.tpl.document._id+'/uncompressed/compiled_output/main.html';

                                fs.readFile(path, 'utf8', (err, text) => {
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

                                    $('p.indent').each(function () {

                                    });

                                    fs.writeFileSync(path, $.html());

                                    return res.redirect('/' + newDocument._id + '/edit/');
                                });
                            });
                        }

                        return res.end("Something went wrong.");
                    });
                }

                throw err_message;
            });
        } catch (err) {
            console.log(err);
            return next(err); // => TypeError, "Failed to construct URL: Invalid URL"
        }
    };

};