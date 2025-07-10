const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
    name:{
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type: String,
        enum: ['volunteer', 'organization'],
        default: 'volunteer',
    },
    experience:[
        {
            opportunityId: {type:mongoose.Schema.Types.ObjectId, ref: 'Opportunity'},
            title: String,
            organization: String,
            date: Date,
        },
    ],
    interests: {
        type: [String],
        default: [],
    },
    tokens: {
        type: [String],
        default: []
    },
    volunteerHistory: [
        {
            opportunity:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Opportunity',
            },
            organization:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            title: String,
            date: Date,
        }
    ],
    isVerified:{
        type: Boolean,
        default: false,
    },
    emailVerificationToken: {
        type: String,
    },
},
{
    timestamps: true,
}
);

module.exports = mongoose.model('User', userSchema);