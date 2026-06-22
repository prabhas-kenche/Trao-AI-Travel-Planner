const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

console.log("Key Prefix:", process.env.GEMINI_API_KEY.substring(0, 10));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });

        const result = await model.generateContent(
            "Say hello"
        );

        console.log(result.response.text());

    } catch (e) {
        console.log("ERROR:");
        console.log(e);
    }
}

test();