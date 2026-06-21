import {useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"

import API from "../services/api"
import TripForm from "../components/TripForm";
import TripList from "../components/TripList";

function Dashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [trips, setTrips] = useState([]);

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

    return (
        <div>
            <h1>Dashboard</h1>

            {user && (
                <>
                    <h2>Welcome {user.name}</h2>
                    <p>{user.password}</p>
                </>
            )}

            <button onClick={handleLogout}>
                Logout
            </button>

            <hr />

            <TripForm onTripCreated={handleTripCreated} />

            <hr />

            <TripList trips={trips} onDelete={handleDelete} />
        </div>
    )
}

export default Dashboard;