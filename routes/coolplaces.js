const express = require('express');
const router = express.Router();
const coolplaces = require('../controllers/coolplaces');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validatePlace } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

// list of COOl places
router.route('/')
    .get(catchAsync(coolplaces.index))
    .post(isLoggedIn, upload.array('image'), validatePlace, catchAsync(coolplaces.createPlace));

// create page
router.get('/new', isLoggedIn, coolplaces.newPlace);

// edit page mechanics
router.route('/:id')
    .get(catchAsync(coolplaces.showPlace))
    .put(isLoggedIn, isAuthor, upload.array('image'), validatePlace, catchAsync(coolplaces.updatePlace))
    .delete(isLoggedIn, isAuthor, catchAsync(coolplaces.deletePlace));

// edit page
router.get('/:id/edit', isLoggedIn, isAuthor, coolplaces.editPlace);

module.exports = router;