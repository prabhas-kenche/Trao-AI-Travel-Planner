function TripList({ trips, onDelete }) {

    return (
        <div>
            <h2>My Trips</h2>
            {trips.map((trip) => (
                <div
                    key={trip._id}
                    style={{
                        border: "1px solid black",
                        padding: "10px",
                        marginBottom: "10px"
                    }}
                >
                    <h3>{trip.destination}</h3>

                    <p>{trip.durationDays} Days</p>
                    <p>{trip.budgetTier}</p>
                    <button onClick={() =>onDelete(trip._id)}>Delete</button>
                </div>
            ))}
        </div>
    );
}

export default TripList;