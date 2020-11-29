const express = require('express');
const router = express.Router();

// middleware
const addDocumentMW = require('../middleware/documents/addDocument');
const getDocumentMW = require('../middleware/documents/getDocument');
const getDocumentListMW = require('../middleware/documents/getDocumentList');
const loadDocumentMW = require('../middleware/documents/loadDocument');
const saveDocumentMW = require('../middleware/documents/saveDocument');
const deleteDocumentMW = require('../middleware/documents/deleteDocument');
const renderMW = require('../middleware/generic/render');
const authMW = require('../middleware/auth/auth');
const inverseAuthMW = require('../middleware/auth/inverseAuth');
const loginMW = require('../middleware/auth/login');
const logoutMW = require('../middleware/auth/logout');
const loginRedirectMW = require('../middleware/generic/loginRedirect');

//models
const documentModel = require('../models/document');

const objectRepository = {
    'documentModel': documentModel
};

/* GET home page. */
router.get('/',
    loginRedirectMW(objectRepository),
    authMW(objectRepository),
    renderMW(objectRepository, 'home')
);

router.post('/login',
    inverseAuthMW(objectRepository),
    loginMW(objectRepository)
);

router.get('/logout',
    authMW(objectRepository),
    logoutMW()
);

router.get('/documents/',
    authMW(objectRepository),
    getDocumentListMW(objectRepository),
    renderMW(objectRepository, 'documents')
);

router.post('/documents/add',
    authMW(objectRepository),
    addDocumentMW(objectRepository)
);

router.post('/documents/:id/save/',
    authMW(),
    getDocumentMW(objectRepository),
    saveDocumentMW(objectRepository)
);

router.get('/documents/:id/edit/',
    authMW(objectRepository),
    function (req, res, next) {
        res.locals.mode = "edit";
        return next();
    },
    getDocumentMW(objectRepository),
    renderMW(objectRepository, 'document')
);

router.get('/documents/:id/edit/raw',
    authMW(objectRepository),
    function (req, res, next) {
        res.locals.mode = "edit";
        return next();
    },
    getDocumentMW(objectRepository),
    loadDocumentMW(objectRepository),
    renderMW(objectRepository, 'document_raw')
);

router.get('/documents/:id/view/',
    function (req, res, next) {
        res.locals.mode = "view";
        return next();
    },
    getDocumentMW(objectRepository),
    renderMW(objectRepository, 'document')
);

router.get('/documents/:id/view/raw',
    function (req, res, next) {
        res.locals.mode = "view";
        return next();
    },
    getDocumentMW(objectRepository),
    loadDocumentMW(objectRepository),
    renderMW(objectRepository, 'document_raw')
);

router.get('/documents/:id/delete/',
    authMW(),
    deleteDocumentMW(objectRepository)
);

module.exports = router;
