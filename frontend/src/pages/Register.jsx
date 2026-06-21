import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api"

function Register() {
    const navigate = useNavigate();

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
        <div>
            <h1>Register</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                />
                <br /><br />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <br /><br />

                <input
                    type="password"
                    name="password"
                    placeholder="password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <br /><br />

                <button type="submit">register</button>
            </form>

            <br />

            <Link to="/">
                Already have an account?
            </Link>
        </div>
    )
}

export default Register;