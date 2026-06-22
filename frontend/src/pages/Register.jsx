import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api"

function Register() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
    
        if(token){
            navigate("/dashboard");
        }
    }, [navigate])

    const [formData, setFormData] = useState({
        name: "",
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
            await API.post("/auth/register", formData);

            alert("Registration Successful");
            navigate("/");
        } catch(e){

            console.log(e);
            console.log(e.message)
            
            alert(e.response?.data?.message ||
                "Registration Failed"
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Register</h1>

                <form onSubmit={handleSubmit}>
                    <input
                        className="w-full border rounded-lg p-3"
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <br /><br />

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
                        placeholder="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <br /><br />

                    <button className="w-full bg-blue-600 text-white py-3 rounded-lg" type="submit">register</button>
                </form>

                <br />

                <Link to="/">
                    Already have an account?
                </Link>
            </div>
        </div>
    )
}

export default Register;