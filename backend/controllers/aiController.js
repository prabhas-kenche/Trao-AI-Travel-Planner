const Trip = require("../models/Trip");

const { generateTripPlan } = require("../services/geminiService");

exports.generateTrip = async (req, res) => {
    try {
        const { destination, durationDays, budgetTier, interests } = req.body;

        const aiResponse = await generateTripPlan(destination, durationDays, budgetTier, interests);

        const cleanedResponse = aiResponse.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsedData = JSON.parse(cleanedResponse);

        const trip = await Trip.create({
            user: req.user._id,
            destination,
            durationDays,
            budgetTier,
            interests,
            itinerary:
                parsedData.itinerary,
            estimatedBudget:
                parsedData.estimatedBudget,
            hotels:
                parsedData.hotels
        });

        res.status(200).json(trip);
    } catch(e) {
        console.log(e);
         res.status(400).json({
            message: "Failed to generate trip"
         });
    }
};