const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateTripPlan = async( destination, durationDays, budgetTier, interests ) => {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash"
    });

    const prompt = `
        Generate a travel plan in JSON format only.

        Destination: ${destination}
        Duration: ${durationDays} days
        Budget: ${budgetTier}
        Interests: ${interests.join(", ")}

        Return exactly this structure:

        {
            "itinerary": [
                {
                    "dayNumber": 1,
                    "activities": [
                        {
                            "title": "",
                            "description": "",
                            "cost": 0
                        }
                    ]
                }
            ],
            "estimatedBudget": {
                "flight": 0,
                "hotel": 0,
                "food": 0,
                "activities": 0,
                "total": 0
            },
            "hotels": [
                {
                    "name": "",
                    "rating": 0,
                    "pricePerNight": 0
                }
            ]
        }

        Return valid JSON only.
    `;

    const result = await model.generateContent(prompt);

    return result.response.text();
};

module.exports = { generateTripPlan };