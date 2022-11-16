const express = require('express');
const router = express.Router({mergeParams: true});
const { validateComment, isLoggedIn, isCommentAuthor } = require('../middleware');
const comments = require('../controllers/comments');
const catchAsync = require('../utils/catchAsync');
const Place = require('../models/place');
const Comment = require('../models/comment');


// add a comment
router.post('/', isLoggedIn, validateComment, catchAsync(comments.addComment));

// delete a comment
router.delete('/:commentID', isLoggedIn, isCommentAuthor, catchAsync(comments.deleteComment));

module.exports = router;