const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
    title: String,
    description: String,
    cost: Number
});

const daySchema = new mongoose.Schema({
    dayNumber: Number,
    activities: [activitySchema]
});

const tripSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    destination: {
        type: String,
        required: true
    },

    durationDays: {
        type: Number,
        required: true
    },

    budgetTier: {
        type: String,
        enum: ["Low", "Medium", "High"],
        required: true
    },


    interests: [
        {
            type: String
        }
    ],

    itinerary: [daySchema],

    estimatedBudget: {
        flight: Number,
        hotel: Number,
        food: Number,
        activities: Number,
        total: Number
    },

    hotels: [
        {
            name: String,
            rating: Number,
            pricePerNight: Number
        }
    ]
},
{
    timestamps: true
});

module.exports = mongoose.model("Trip", tripSchema);