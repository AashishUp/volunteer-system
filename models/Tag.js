const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    weight :{
        type: Number,
        default: 1
    }
});

module.exports = mongoose.model('Tag', tagSchema);