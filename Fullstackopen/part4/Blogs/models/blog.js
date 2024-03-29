const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        minLength: 3,
        required: true,
        unique: true
    },
    author: String,
    url: {
        type: String,
        minlength: 5,
        required: true,
        unique: true
    },
    likes: Number,
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

blogSchema.plugin(uniqueValidator);

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id
      delete returnedObject.__v
    }
})

module.exports = mongoose.model('Blog', blogSchema)