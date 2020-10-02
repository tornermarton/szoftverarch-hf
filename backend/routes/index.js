const express = require('express');
const router = express.Router();

const prepareDocumentMW = require('../middleware/prepareDocument');
const loadDocumentMW = require('../middleware/loadDocument');

const renderMW = require('../middleware/generic/render');

const objectRepository = {};

/* GET home page. */
router.get('/',
    renderMW(objectRepository, 'index'),
);

router.post('/link',
    prepareDocumentMW(objectRepository)
);

// developer only
router.get('/edit',
    function (req, res, next) {
        res.json(req.session.documents)
    }
);

router.post('/edit',
    function (req, res, next) {
        res.redirect('/edit/' + req.body.document_id)
    }
);

router.get('/edit/:id',
    loadDocumentMW(objectRepository),
    renderMW(objectRepository, 'editor')
);

module.exports = router;
