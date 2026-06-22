import { Link } from "react-router-dom";

function Navbar({ user, onLogout }) {
    return (
        <nav className="bg-white shadow-md rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-blue-600 text-gray-800">
                        AI Travel Planner
                    </h1>
                </div>

                <div className="flex items-center gap-6">
                    <span className="text-gray-700 font-medium">
                        {user?.name}
                    </span>

                    <Link
                        to="/dashboard"
                        className="text-blue-600 hover:text-blue-800 text-medium"
                    >
                        Dashboard
                    </Link>

                    <button
                        onClick={onLogout}
                        className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;