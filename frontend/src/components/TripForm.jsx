import { useState } from "react";
import API from "../services/api";

function TripForm({ onTripCreated }){
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

        try {
            const tripData = {
                destination: formData.destination,
                durationDays: Number(formData.durationDays),
                budgetTier: formData.budgetTier,
                interests: formData.interests
                    .split(",").map(item => item.trim())
            };

            const response = await API.post("/trips", tripData);
            onTripCreated(response.data);

            alert("trip Created");

            setFormData({
                destination: "",
                durationDays: "",
                budgetTier: "Medium",
                interests: ""
            });
        } catch(e) {
            alert(e.response?.data?.message || "Failed to create trip");
        };
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create Trip</h2>

            <input
                type="text"
                name="destination"
                placeholder="Destination"
                value={formData.destination}
                onChange={handleChange}
            />

            <br /><br />

            <input
                type="number"
                name="durationDays"
                placeholder="Days"
                value={formData.durationDays}
                onChange={handleChange}
            />

            <br /><br />

            <select
                name="budgetTier"
                value={formData.budgetTier}
                onChange={handleChange}
            >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>

            <br /><br />

            <input
                type="text"
                name="interests"
                placeholder="Food, Adventure, Culture"
                value={formData.interests}
                onChange={handleChange}
            />

            <br /><br />

            <button type="submit">
                Create Trip
            </button>

        </form>
    );
}

export default TripForm;