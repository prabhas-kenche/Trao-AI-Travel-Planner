const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { generateTrip, regenerateTrip, addActivity, deleteActivity, regenerateDay} = require("../controllers/aiController");

router.post("/generate-trip", authMiddleware, generateTrip);
router.put("/regenerate-trip/:tripId", authMiddleware, regenerateTrip);
router.delete("/delete-activity/:tripId/:dayNumber/:activityId", authMiddleware, deleteActivity)
router.post("/add-activity/:tripId/:dayNumber", authMiddleware, addActivity);
router.put("/regenerate-day/:tripId", authMiddleware, regenerateDay);

module.exports = router;