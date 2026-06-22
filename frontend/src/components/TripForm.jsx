import { useState } from "react";
import API from "../services/api";

function TripForm({ onTripCreated, setLoading }){
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        destination: "",
        durationDays: "",
        budgetTier: "Medium",
        interests: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        if(!formData.destination || !formData.durationDays || !formData.interests) {
            alert("Please fill all fields");
            return;
        }

        setSubmitting(true);

        try {
            const tripData = {
                destination: formData.destination,
                durationDays: Number(formData.durationDays),
                budgetTier: formData.budgetTier,
                interests: formData.interests
                    .split(",").map(item => item.trim())
            };

            const response = await API.post("/ai/generate-trip", tripData);
            onTripCreated(response.data);
            setLoading(true);

            alert("AI Trip Generated Successfully !");

            setFormData({
                destination: "",
                durationDays: "",
                budgetTier: "Medium",
                interests: ""
            });
        } catch(e) {
            alert(e.response?.data?.message || "Failed to create trip");
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">
                Generate AI Trip
            </h2>

            <div className="space-y-4">
                <input
                    type="text"
                    name="destination"
                    placeholder="Destination"
                    value={formData.destination}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                />

                <input
                    type="number"
                    name="durationDays"
                    placeholder="Duration (Days)"
                    value={formData.durationDays}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                />

                <select
                    name="budgetTier"
                    value={formData.budgetTier}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>

                <input
                    type="text"
                    name="interests"
                    placeholder="Food, Culture, Shopping"
                    value={formData.interests}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                />

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
                >
                    {submitting
                        ? "Generating..."
                        : "Generate AI Trip"}
                </button>
            </div>
        </form>
    );
}

export default TripForm;