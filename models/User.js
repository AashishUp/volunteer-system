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
},
{
    timestamps: true,
}
);

module.exports = mongoose.model('User', userSchema);