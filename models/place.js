const mongoose = require('mongoose');
const Comment = require('./comment');
const Schema = mongoose.Schema;

const PlaceSchema = new Schema({
    title: String,
    image: [
        {
            url: String,
            filename: String
        }
    ],
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

PlaceSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Comment.remove({
            _id: {
                $in: doc.comments
            }
        }) 
    }
});

module.exports = mongoose.model('Place', PlaceSchema);
