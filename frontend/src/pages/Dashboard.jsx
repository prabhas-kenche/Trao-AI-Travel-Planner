import {useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"

import Navbar from "../components/Navbar";
import API from "../services/api"
import TripForm from "../components/TripForm";
import TripList from "../components/TripList";

function Dashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [user, setUser] = useState(null);
    const [trips, setTrips] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchProfile = async() => {
            try {
                const response = await API.get("/auth/profile");
                setUser(response.data);
            } catch(e) {
                console.log(e.message);
                localStorage.removeItem("token");
                navigate("/");
            }
        };

        const fetchTrips = async() => {
            try {
                const response = await API.get("/trips");
                setTrips(response.data);
            }catch(e){
                console.log(e);
            }
        };

        fetchProfile();
        fetchTrips();

    }, [navigate]);

    const handleTripCreated = (trip) => {
        setTrips((prev) => [
            trip,
            ...prev
        ]);
    };

    const handleRegenerate = async (tripId, updatedData) => {
        try {
            setLoading(true);

            const response = await API.put(`/ai/regenerate-trip/${tripId}`, updatedData);

            setTrips((prevTrips) =>
                prevTrips.map((trip) =>
                    trip._id === tripId
                        ? response.data
                        : trip
                )
            );

            alert("Trip regenerated successfully")
        } catch (e){
            console.log(e.response);
            console.log(e.response?.data);

            alert(
                e.response?.data?.message || "Failed to regenerate trip"
            );
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (tripId) => {
        try {
            await API.delete(`/trips/${tripId}`);
            setTrips(trips.filter(
                trip => trip._id !== tripId
            ));
        } catch(e) {
            console.log(e);
        }
    }
    const handleLogout = () => {
        localStorage.removeItem("token");

        navigate("/");
    };

    const totalBudget = trips.reduce(
        (sum, trip) => sum + (trip.estimatedBudget?.total || 0),
        0
    );

    const uniqueDestinations = [
        ...new Set(
            trips.map((trip) => trip.destination)
        ),
    ];

    const filteredTrips = trips.filter((trip) =>
        trip.destination
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    const sortedTrips = [...filteredTrips].sort(
        (a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
    );

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto p-6">
                <Navbar user={user} onLogout={handleLogout}/>
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            {user && (
                                <>
                                    <h2 className="text-xl mt-2">
                                        Welcome, {user.name}
                                    </h2>

                                    <p className="text-gray-600">
                                        {user.email}
                                    </p>

                                    <p className="mt-1">
                                        Total Trips: {trips.length}
                                    </p>
                                </>
                            )}
                        </div>
                        <div className="mb-6 flex">
                                <input
                                    type="text"
                                    placeholder="Search destination..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="ml-auto w-80 p-3 border rounded-lg"
                                />
                            </div>
                    </div>
                </div>

                {loading && (
                    <div className="bg-blue-100 text-blue-700 p-4 rounded-lg mb-6">
                        Generating AI Trip Plan...
                    </div>
                )}

                <TripForm
                    onTripCreated={handleTripCreated}
                    setLoading={setLoading}
                />

                <div className="mt-8">
                    <TripList
                        trips={sortedTrips}
                        onDelete={handleDelete}
                        onRegenerate={handleRegenerate}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

                    <div className="bg-white p-5 rounded-xl shadow">
                        <h3 className="text-gray-500">
                            Total Trips
                        </h3>

                        <p className="text-3xl font-bold">
                            {trips.length}
                        </p>
                    </div>

                    <div className="bg-white p-5 rounded-xl shadow">
                        <h3 className="text-gray-500">
                            Destinations
                        </h3>

                        <p className="text-3xl font-bold">
                            {uniqueDestinations.length}
                        </p>
                    </div>

                    <div className="bg-white p-5 rounded-xl shadow">
                        <h3 className="text-gray-500">
                            Total Budget
                        </h3>

                        <p className="text-3xl font-bold">
                            ${totalBudget}
                        </p>
                    </div>

                </div>

            </div>
            <footer className="text-center text-gray-500 py-6">
                AI Travel Planner - 2026
            </footer>
        </div>
    )
}

export default Dashboard;