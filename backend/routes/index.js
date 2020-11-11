const express = require('express');
const router = express.Router();

// middleware
const prepareDocumentMW = require('../middleware/documents/addDocument');
const getDocumentMW = require('../middleware/documents/getDocument');
const loadDocumentMW = require('../middleware/documents/loadDocument');
const renderMW = require('../middleware/generic/render');

//models
const documentModel = require('../models/document');

const objectRepository = {
    'documentModel': documentModel
};

/* GET home page. */
router.get('/',
    renderMW(objectRepository, 'index'),
);

router.post('/link',
    prepareDocumentMW(objectRepository)
);

router.get('/:id/:mode/',
    function (req, res, next) {
        res.tpl.mode = req.params.mode;
        return next();
    },
    getDocumentMW(objectRepository),
    renderMW(objectRepository, 'document_wrapper')
);

router.get('/document/:id/:mode/',
    function (req, res, next) {
        res.tpl.mode = req.params.mode;
        return next();
    },
    getDocumentMW(objectRepository),
    loadDocumentMW(objectRepository),
    renderMW(objectRepository, 'document')
);

module.exports = router;
