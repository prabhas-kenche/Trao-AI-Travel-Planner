import { useState } from "react";
import API from "../services/api"

function TripList({ trips, onDelete, onRegenerate }) {
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [regeneratingTrip, setRegeneratingTrip] = useState(null);
    const [addingActivity, setAddingActivity] = useState(null);
    const [regeneratingDay, setRegeneratingDay] = useState(null);

    const [editingTrip, setEditingTrip] = useState(null);
    const [editData, setEditData] = useState({
        destination: "",
        durationDays: "",
        budgetTier: "",
        interests: "",
    });

    const handleDelete = (tripId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this trip?"
        );

        if (confirmDelete) {
            onDelete(tripId);
        }
    };

    const handleRegenerateClick = async (
        tripId,
        updatedData
    ) => {
        try {
            setRegeneratingTrip(tripId);

            await onRegenerate(
                tripId,
                updatedData
            );

        } finally {
            setRegeneratingTrip(null);
        }
    };

    const deleteActivity = async (tripId, dayNumber, activityId) => {
        try {
            await API.delete(
                `/ai/delete-activity/${tripId}/${dayNumber}/${activityId}`
            );

            window.location.reload();
        } catch (e) {
            console.log(e);
            alert("Failed to delete activity");
        }
    };

    const addActivity = async (tripId, dayNumber) => {
        const title = prompt("Activity Title");

        if (!title) return;

        const description = prompt("Description");

        const cost = prompt("Cost");
        setAddingActivity(`${tripId}-${dayNumber}`);

        try {
            await API.post(
                `/ai/add-activity/${tripId}/${dayNumber}`,
                {
                    title,
                    description,
                    cost: Number(cost)
                }
            );

            window.location.reload();
        } catch (e) {
            console.log(e);
            alert("Failed to add activity");
        } finally {
            setAddingActivity(null);
        }
    };

    const regenerateDay = async ( tripId, dayNumber ) => {
        const instruction = prompt("What changes do you want?");

        if (!instruction) return;

        try {
            setRegeneratingDay(`${tripId}-${dayNumber}`);
            await API.put(
                `/ai/regenerate-day/${tripId}`,
                {
                    dayNumber,
                    instruction
                }
            );

            window.location.reload();

        } catch (e) {
            console.log(e);
            alert("Failed to regenerate day");
        } finally {
            setRegeneratingDay(null);
        }
    };

    if (trips.length === 0) {
        return (
            <div className="bg-white p-8 rounded-xl shadow text-center">
                <h2 className="text-2xl mb-2">No trips Yet</h2>
                <p className="text-gray-500">Generate your first AI trip!</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">My Trips</h2>

            {trips.map((trip) => (
                <div
                    key={trip._id}
                    className="bg-white rounded-xl shadow-md p-5 mb-5"
                >
                    <h3 className="text-2xl font-bold text-blue-600">{trip.destination}</h3>

                    <p>
                        <strong>Duration:</strong> {trip.durationDays} Days
                    </p>

                    <p>
                        <strong>Budget Tier:</strong> {trip.budgetTier}
                    </p>

                    <p>
                        <strong>Estimated Budget:</strong> $
                        {trip.estimatedBudget?.total}
                    </p>

                    <p>
                        <strong>Interests:</strong>{" "}
                        {trip.interests?.join(", ")}
                    </p>

                    <div className="mt-4 flex gap-3">
                        <button
                            onClick={() => handleDelete(trip._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                        >
                            Delete
                        </button>

                        <button
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                            onClick={async () => {
                                handleRegenerateClick(trip._id, {});
                            }}
                            disabled={regeneratingTrip === trip._id}
                        >
                            {
                                regeneratingTrip === trip._id
                                    ? "Regenerating..."
                                    : "Regenerate"
                            }
                        </button>

                        <button
                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                            onClick={() => {
                                setEditingTrip(trip._id);

                                setEditData({
                                    destination: trip.destination,
                                    durationDays: trip.durationDays,
                                    budgetTier: trip.budgetTier,
                                    interests:
                                        trip.interests.join(", "),
                                });
                            }}
                        >
                            Edit
                        </button>

                        <button
                            onClick={() =>
                                setSelectedTrip(
                                    selectedTrip === trip._id
                                        ? null
                                        : trip._id
                                )
                            }
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                        >
                            {selectedTrip === trip._id
                                ? "Hide Details"
                                : "View Details"}
                        </button>
                    </div>

                    {editingTrip === trip._id && (
                            <div className="mt-4 border p-4 rounded-lg">
                                <input
                                    type="text"
                                    value={editData.destination}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            destination:
                                                e.target.value,
                                        })
                                    }
                                    className="border p-2 w-full mb-2"
                                />

                                <input
                                    type="number"
                                    value={editData.durationDays}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            durationDays:
                                                e.target.value,
                                        })
                                    }
                                    className="border p-2 w-full mb-2"
                                />

                                <select
                                    value={editData.budgetTier}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            budgetTier:
                                                e.target.value,
                                        })
                                    }
                                    className="border p-2 w-full mb-2"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">
                                        Medium
                                    </option>
                                    <option value="High">
                                        High
                                    </option>
                                </select>

                                <input
                                    type="text"
                                    value={editData.interests}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            interests:
                                                e.target.value,
                                        })
                                    }
                                    className="border p-2 w-full mb-3"
                                />

                                <button
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg"
                                    onClick={() => {
                                        onRegenerate(
                                            trip._id,
                                            {
                                                destination:
                                                    editData.destination,

                                                durationDays:
                                                    Number(
                                                        editData.durationDays
                                                    ),

                                                budgetTier:
                                                    editData.budgetTier,

                                                interests:
                                                    editData.interests
                                                        .split(",")
                                                        .map(
                                                            (item) =>
                                                                item.trim()
                                                        ),
                                            },
                                            setRegeneratingTrip
                                        );

                                        setEditingTrip(null);
                                    }}
                                >
                                    Save & Regenerate
                                </button>
                            </div>
                        )}

                    {selectedTrip === trip._id && (
                        <div className="mt-6 border-t pt-4">
                            <hr />

                            <h4>Itinerary</h4>

                            {trip.itinerary?.map((day) => (
                                <div
                                    key={day._id || day.dayNumber}
                                    style={{
                                        marginBottom: "15px",
                                    }}
                                >
                                    <h5 className="font-bold text-lg">Day {day.dayNumber}</h5>

                                    <ul>
                                        {day.activities?.map(
                                            (activity) => (
                                                <li
                                                    key={
                                                        activity._id ||
                                                        activity.title
                                                    }
                                                    className="mb-3"
                                                >
                                                    <strong>
                                                        {
                                                            activity.title
                                                        }
                                                    </strong>

                                                    <br />

                                                    {
                                                        activity.description
                                                    }

                                                    <br />

                                                    <small>
                                                        Cost: $
                                                        {
                                                            activity.cost
                                                        }
                                                    </small>
                                                    <button
                                                        onClick={() =>
                                                            deleteActivity(trip._id, day.dayNumber, activity._id)
                                                        }
                                                        className="bg-red-500 text-white px-2 py-1 rounded ml-2 text-sm"
                                                    >
                                                        Delete
                                                    </button>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                    <div className="flex gap-2 mt-3">
                                        <button
                                            onClick={() =>
                                                addActivity(trip._id, day.dayNumber)
                                            }
                                            disabled={
                                                addingActivity === `${trip._id}-${day.dayNumber}`
                                            }
                                            className="bg-blue-500 text-white px-3 py-1 rounded"
                                        >
                                            {
                                                addingActivity ===
                                                `${trip._id}-${day.dayNumber}`
                                                    ? "Adding..."
                                                    : "+ Add Activity"
                                            }
                                        </button>

                                        <button
                                            onClick={() =>
                                                regenerateDay(trip._id, day.dayNumber)
                                            }
                                            disabled={regeneratingDay ===`${trip._id}-${day.dayNumber}`}
                                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                                        >
                                            {
                                                regeneratingDay === `${trip._id}-${day.dayNumber}`
                                                    ? "Regenerating Day..."
                                                    : "regenerate Day"
                                            }
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <hr />

                            <h4 className="text-xl font-bold mt-6 mb-3">Hotels</h4>

                            <ul>
                                {trip.hotels?.map((hotel) => (
                                    <li key={hotel._id}>
                                        <strong>
                                            {hotel.name}
                                        </strong>

                                        {" | "}Rating:
                                        {hotel.rating}

                                        {" | "}
                                        $
                                        {hotel.pricePerNight}
                                        /night
                                    </li>
                                ))}
                            </ul>

                            <hr />

                            <h4 className="text-xl font-bold mt-6 mb-3">Budget Breakdown</h4>

                            <p>
                                Flight: $
                                {
                                    trip.estimatedBudget
                                        ?.flight
                                }
                            </p>

                            <p>
                                Hotel: $
                                {
                                    trip.estimatedBudget
                                        ?.hotel
                                }
                            </p>

                            <p>
                                Food: $
                                {
                                    trip.estimatedBudget
                                        ?.food
                                }
                            </p>

                            <p>
                                Activities: $
                                {
                                    trip.estimatedBudget
                                        ?.activities
                                }
                            </p>

                            <p>
                                <strong>
                                    Total: $
                                    {
                                        trip
                                            .estimatedBudget
                                            ?.total
                                    }
                                </strong>
                            </p>

                            <p>
                                Created: {" "}
                                {new Date(trip.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default TripList;