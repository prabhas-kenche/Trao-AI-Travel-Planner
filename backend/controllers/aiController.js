const Trip = require("../models/Trip");

const { generateTripPlan, regenerateDayPlan } = require("../services/geminiService");

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
        consol.log("AI Error :")
        console.log(e);
         res.status(400).json({
            message: "AI service is busy. Please try again in a few seconds."
         });
    }
};

exports.regenerateTrip = async (req, res) => {
    try {
        const trip = await Trip.findOne({
            _id: req.params.tripId,
            user: req.user._id
        });

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }

        const {
            destination,
            durationDays,
            budgetTier,
            interests
        } = req.body;

        const updatedDestination = destination || trip.destination;

        const updatedDuration = durationDays || trip.durationDays;

        const updatedBudget = budgetTier || trip.budgetTier;

        const updatedInterests = interests || trip.interests;

        const aiResponse = await generateTripPlan(
            updatedDestination,
            updatedDuration,
            updatedBudget,
            updatedInterests
        );

        const cleanedResponse = aiResponse
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const parsedData = JSON.parse(cleanedResponse);

        trip.destination = updatedDestination;
        trip.durationDays = updatedDuration;
        trip.budgetTier = updatedBudget;
        trip.interests = updatedInterests;

        trip.itinerary = parsedData.itinerary;
        trip.estimatedBudget =
            parsedData.estimatedBudget;
        trip.hotels = parsedData.hotels;

        await trip.save();

        res.status(200).json(trip);

    } catch (e) {
        console.log(e);

        res.status(400).json({
            message: "Failed to regenerate trip"
        });
    }
};

exports.regenerateDay = async (req, res) => {
    try {
        const { dayNumber, instruction } = req.body;

        const trip = await Trip.findOne({
            _id: req.params.tripId,
            user: req.user._id
        });

        if(!trip) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }

        const aiResponse =
            await regenerateDayPlan(
                trip.destination,
                trip.durationDays,
                trip.budgetTier,
                trip.interests,
                dayNumber,
                instruction
            );
            console.log("AI RESPONSE");
            console.log(aiResponse);

        const parsedData =
            JSON.parse(
                aiResponse
                    .replace(/```json/g, "")
                    .replace(/```/g, "")
                    .trim()
            );

        const dayIndex =
            trip.itinerary.findIndex(
                d =>
                    d.dayNumber ===
                    Number(dayNumber)
            );

        if(dayIndex === -1){
            return res.status(404).json({
                message: "Day not found"
            });
        }

        trip.itinerary[dayIndex].dayNumber = parsedData.dayNumber;
        trip.itinerary[dayIndex].activities = parsedData.activities;

        const activityCost =
            trip.itinerary.reduce(
                (daySum, day) =>
                    daySum +
                    day.activities.reduce(
                        (activitySum, activity) =>
                            activitySum +
                            (activity.cost || 0),
                        0
                    ),
                0
            );

        trip.estimatedBudget.activities =
            activityCost;

        trip.estimatedBudget.total =
            trip.estimatedBudget.flight +
            trip.estimatedBudget.hotel +
            trip.estimatedBudget.food +
            activityCost;

        trip.markModified("estimatedBudget");

        trip.markModified("itinerary");
        await trip.save();

        res.status(200).json(trip);

    } catch (e) {
        console.log(e);
        res.status(500).json({
            message:
                "Failed to regenerate day"
        });
    }
};

exports.deleteActivity = async (req, res) => {
    try {
        const { tripId, dayNumber, activityId } = req.params;

        const trip = await Trip.findOne({
            _id: tripId,
            user: req.user._id
        });

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }

        const day = trip.itinerary.find(
            d => d.dayNumber === Number(dayNumber)
        );

        if (!day) {
            return res.status(404).json({
                message: "Day not found"
            });
        }

        day.activities =
            day.activities.filter(
                activity =>
                    activity._id.toString() !== activityId
            );

        const activityCost =
            trip.itinerary.reduce(
                (daySum, day) =>
                    daySum +
                    day.activities.reduce(
                        (activitySum, activity) =>
                            activitySum +
                            (activity.cost || 0),
                        0
                    ),
                0
            );

        trip.estimatedBudget.activities =
            activityCost;

        trip.estimatedBudget.total =
            trip.estimatedBudget.flight +
            trip.estimatedBudget.hotel +
            trip.estimatedBudget.food +
            activityCost;

        trip.markModified("estimatedBudget");

        await trip.save();

        await trip.save();

        res.status(200).json(trip);

    } catch (e) {
        res.status(500).json({
            message: "Failed to delete activity"
        });
    }
};

exports.addActivity = async (req, res) => {
    try {
        const { tripId, dayNumber } = req.params;

        const {
            title,
            description,
            cost
        } = req.body;

        const trip = await Trip.findOne({
            _id: tripId,
            user: req.user._id
        });

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }

        const day = trip.itinerary.find(
            d => d.dayNumber === Number(dayNumber)
        );

        day.activities.push({
            title,
            description,
            cost
        });

        const activityCost =
            trip.itinerary.reduce(
                (daySum, day) =>
                    daySum +
                    day.activities.reduce(
                        (activitySum, activity) =>
                            activitySum +
                            (activity.cost || 0),
                        0
                    ),
                0
            );

        trip.estimatedBudget.activities =
            activityCost;

        trip.estimatedBudget.total =
            trip.estimatedBudget.flight +
            trip.estimatedBudget.hotel +
            trip.estimatedBudget.food +
            activityCost;

        trip.markModified("estimatedBudget");

        await trip.save();

        res.status(200).json(trip);

    } catch (e) {
        res.status(500).json({
            message: "Failed to add activity"
        });
    }
};
