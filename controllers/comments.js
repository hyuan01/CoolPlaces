const Place = require('../models/place');
const Comment = require('../models/comment');

// add a comment
module.exports.addComment = async (req, res) => {
    const place = await Place.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    comment.author = req.user._id;
    place.comments.push(comment);
    await comment.save();
    await place.save();
    req.flash('success', 'Comment added!');
    res.redirect(`/coolplaces/${place._id}`);
};

// delete a comment
module.exports.deleteComment = async (req, res) => {
    const { id, commentID } = req.params;
    await Place.findByIdAndUpdate(id, {$pull: {comments: commentID}});
    await Comment.findByIdAndDelete(commentID);
    req.flash('success', 'Comment deleted!');
    res.redirect(`/coolplaces/${id}`);
};