const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true,
        },
        description:{
            type: String,
            required: true,
        },
        location:{
            type: String,
            required: true,
        },
        startDate:{
            type: Date,
            required: true,
        },
        endDate:{
            type: Date,
            required: true,
        },
        requiredSkills:[String],
        postedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
        applicants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
      ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Opportunity", opportunitySchema);