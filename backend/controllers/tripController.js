const Trip = require("../models/Trip");

exports.createTrip = async (req, res) => {
    try{
        const {destination, durationDays, budgetTier, interests} = req.body;

        const trip = await Trip.create({
            user: req.user.id,
            destination,
            durationDays,
            budgetTier,
            interests
        });

        res.status(200).json(trip);
    } catch (e) {
        res.status(400).json({
            message: e.message
        });
    }
};

exports.getMyTrips = async (req, res) => {
    try {
        const trips = await Trip.find({
            user: req.user.id
        });
        res.status(200).json(trips);
    } catch(e) {
        res.status(400).json({
            message: error.message
        });
    }
};


exports.getTripById = async(req, res) => {
    try {
        const trip = await Trip.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if(!trip) {
            return res.status(400).json({
                message: "Trip not found"
            });
        }
        res.json(trip);
    }catch(e) {
        res.status(400).json({
            message: e.message
        });
    }
};


exports.updateTrip = async (req, res) => {
    try {
        const trip= await Trip.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id
            },
            req.body,
            {
                new: true
            }
        );
        if(!trip) {
            return res.status(400).json({
                message: "Trip not found"
            });
        }
        res.json(trip);
    } catch (e) {
        res.status(400).json({
            message: e.message
        });
    }
};


exports.deleteTrip = async (req, res) => {
    try{
        const trip = await Trip.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if(!trip) {
            return res.status(400).json({
                message: "Trip not found"
            });
        }

        res.json({
            message: "Trip deleted"
        });
    } catch (e) {
        res.status(400).json({
            message: e.message
        });
    }
};