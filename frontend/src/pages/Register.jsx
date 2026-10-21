import { useState } from "react";
import api from "../api/apiClient";

function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        registerNumber: "",
        department: "",
        cgpa: "",
        graduationYear: "",
        skills: ""
    });

    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post(
                "/api/auth/register",
                {
                    ...formData,
                    cgpa: Number(formData.cgpa),
                    graduationYear: Number(formData.graduationYear),
                    skills: formData.skills
                        .split(",")
                        .map((skill) => skill.trim())
                        .filter((skill) => skill !== "")
                }
            );

            setMessage(response.data.message);
            setIsError(false);

            setFormData({
                name: "",
                email: "",
                password: "",
                registerNumber: "",
                department: "",
                cgpa: "",
                graduationYear: "",
                skills: ""
            });

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Registration failed"
            );
            setIsError(true);
        }
    };

    return (
        <div className="register-page">

            <div className="register-left">

                <div className="brand">
                    <div className="brand-icon">LP</div>
                    <div>
                         <h2>LaunchPath</h2>
                         <p>Career Growth & Placement Platform</p>
                          </div>
                          </div>

                <div className="welcome-content">
                    <h1>
                        Build Your
                        <span> Career Journey.</span>
                    </h1>

                    <p>
                        Create your student profile and get ready for
                        your next placement opportunity.
                    </p>

                    <div className="feature-list">
                        <div>✓ Placement Eligibility Checker</div>
                        <div>✓ Skill Gap Analysis</div>
                        <div>✓ Placement Readiness Score</div>
                        <div>✓ Preparation Tracking</div>
                    </div>
                </div>

            </div>


            <div className="register-right">

                <div className="register-card">

                    <div className="form-header">
                        <h1>Create Student Account</h1>
                        <p>
                            Enter your academic and personal details
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="input-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="student@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-row">

                            <div className="input-group">
                                <label>Register Number</label>
                                <input
                                    type="text"
                                    name="registerNumber"
                                    placeholder="23AI001"
                                    value={formData.registerNumber}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="input-group">
                                <label>Department</label>
                                <input
                                    type="text"
                                    name="department"
                                    placeholder="AI&DS"
                                    value={formData.department}
                                    onChange={handleChange}
                                />
                            </div>

                        </div>

                        <div className="form-row">

                            <div className="input-group">
                                <label>CGPA</label>
                                <input
                                    type="number"
                                    name="cgpa"
                                    placeholder="8.50"
                                    step="0.01"
                                    min="0"
                                    max="10"
                                    value={formData.cgpa}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="input-group">
                                <label>Graduation Year</label>
                                <input
                                    type="number"
                                    name="graduationYear"
                                    placeholder="2028"
                                    value={formData.graduationYear}
                                    onChange={handleChange}
                                />
                            </div>

                        </div>

                        <div className="input-group">
                            <label>Technical Skills</label>
                            <input
                                type="text"
                                name="skills"
                                placeholder="Java, SQL, React"
                                value={formData.skills}
                                onChange={handleChange}
                            />
                            <small>
                                Separate multiple skills using commas
                            </small>
                        </div>

                        <button
                            type="submit"
                            className="register-button"
                        >
                            Create Account
                            <span>→</span>
                        </button>

                    </form>

                    {message && (
                        <div
                            className={
                                isError
                                    ? "message error"
                                    : "message success"
                            }
                        >
                            {isError ? "✕ " : "✓ "}
                            {message}
                        </div>
                    )}

                    <p className="login-text">
                        Already have an account?
                        <span> Login</span>
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Register;