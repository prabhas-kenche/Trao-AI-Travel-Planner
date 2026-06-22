import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if(token){
            navigate("/dashboard");
        }
    }, [navigate])

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await API.post("/api/auth/login", formData);
            localStorage.setItem("token", response.data.token);

            alert("login Successful");
            navigate("/dashboard");
        } catch (e) {
            alert(e.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
                    Login
                </h1>
                <form onSubmit={handleSubmit}>
                    <input
                        className="w-full border rounded-lg p-3"
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <br /><br />

                    <input
                        className="w-full border rounded-lg p-3"
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    <br /><br />

                    <button className="w-full bg-blue-600 text-white py-3 rounded-lg" type="submit">
                        Login
                    </button>
                </form>

                <br />

                <Link to="/register">
                    Create Account
                </Link>
            </div>
        </div>
    );
}

export default Login