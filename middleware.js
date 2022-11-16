const { placeSchema, commentSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Place = require('./models/place');
const Comment = require('./models/comment.js');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in!');
        return res.redirect('/login');
    }
    next();
}

// JOI validation
module.exports.validatePlace = (req, res, next) => {
    const { error } = placeSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400); 
    } else {
        next();
    }
};

// Prevent users from editing/deleting stuff that isn't theirs
module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const place = await Place.findById(id);
    if (req.user === undefined || !place.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to delete this COOL place.');
        return res.redirect(`/coolplaces/${id}`);
    }
    next();
};

// Prevent users from editing/deleting stuff that isn't theirs
module.exports.isCommentAuthor = async(req, res, next) => {
    const { id, commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (req.user === undefined || !comment.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to delete this comment.');
        return res.redirect(`/coolplaces/${id}`);
    }
    next();
};



// Comment validation
module.exports.validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400); 
    } else {
        next();
    }
};


