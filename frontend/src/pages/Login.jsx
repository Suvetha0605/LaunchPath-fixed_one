import { useState } from "react";
import api from "../api/apiClient";
import { useNavigate } from "react-router-dom";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState("student");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage("");
        setIsError(false);

        try {
            const response = await api.post(
                "/api/auth/login",
                {
                    ...formData,
                    role: selectedRole
                }
            );

            const loggedInUser = response.data.user;
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(loggedInUser));

            if (loggedInUser.role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/dashboard");
            }

            setMessage(response.data.message);
            setIsError(false);
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Login failed. Please try again."
            );
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            {/* LEFT SIDE */}

            <div className="login-hero">

                <div className="login-brand">
                    <div className="brand-logo">
                        LP
                    </div>

                    <div>
                        <h2>LaunchPath</h2>
                        <p>Career Growth & Placement Platform</p>
                    </div>
                </div>

                <div className="hero-content">

                    <span className="hero-badge">
                        CAREER INTELLIGENCE PLATFORM
                    </span>

                    <h1>
                        Your Skills.
                        <br />
                        Your Journey.
                        <br />
                        <span>Your Opportunity.</span>
                    </h1>

                    <p>
                        Prepare smarter, discover opportunities,
                        and take control of your placement journey
                        from one powerful platform.
                    </p>

                    <div className="hero-features">

                        <div className="hero-feature">
                            <div className="feature-icon">✓</div>
                            <div>
                                <strong>Smart Eligibility</strong>
                                <small>
                                    Know which drives you qualify for
                                </small>
                            </div>
                        </div>

                        <div className="hero-feature">
                            <div className="feature-icon">↗</div>
                            <div>
                                <strong>Skill Development</strong>
                                <small>
                                    Identify skills you need to improve
                                </small>
                            </div>
                        </div>

                        <div className="hero-feature">
                            <div className="feature-icon">★</div>
                            <div>
                                <strong>Career Preparation</strong>
                                <small>
                                    Track your placement preparation
                                </small>
                            </div>
                        </div>

                    </div>

                </div>

                <div className="hero-footer">
                    <span>Smart Campus</span>
                    <span>•</span>
                    <span>Career Growth</span>
                    <span>•</span>
                    <span>Future Ready</span>
                </div>

            </div>


            {/* RIGHT SIDE */}

            <div className="login-section">

                <div className="login-card">

                    <div className="login-header">

                        <span className="mobile-logo">
                            SP
                        </span>

                        <h1>Welcome back 👋</h1>

                        <p>
                            Sign in to continue your placement journey.
                        </p>

                    </div>


                    <div className="role-selector">

                        <button
                            type="button"
                            className={`role ${selectedRole === "student" ? "active" : ""}`}
                            onClick={() => {
                                setSelectedRole("student");
                                setMessage("");
                                setIsError(false);
                            }}
                        >
                            <span>🎓</span>
                            Student
                        </button>

                        
<button
    type="button"
    className={`role ${selectedRole === "admin" ? "active" : ""}`}
    onClick={() => {
        setSelectedRole("admin");
        setMessage("");
        setIsError(false);
    }}
>
    <span>💼</span>
    Admin
</button>


                    </div>


                    <form onSubmit={handleSubmit}>

                        <div className="login-input">

                            <label>Email Address</label>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    @
                                </span>

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                        </div>


                        <div className="login-input">

                            <div className="password-label">

                                <label>Password</label>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword
                                        ? "Hide"
                                        : "Show"}
                                </button>

                            </div>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    🔒
                                </span>

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                        </div>


                        <div className="login-options">

                            <label>
                                <input type="checkbox" />
                                <span>Remember me</span>
                            </label>

                            <button
                                type="button"
                                className="forgot-password"
                            >
                                Forgot password?
                            </button>

                        </div>


                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Signing in..."
                                : "Continue to Portal"}

                            {!loading && (
                                <span>→</span>
                            )}
                        </button>

                    </form>


                    {message && (
                        <div
                            className={
                                isError
                                    ? "login-message error"
                                    : "login-message success"
                            }
                        >
                            {isError ? "✕" : "✓"}
                            <span>{message}</span>
                        </div>
                    )}


                    <div className="register-link">

                        <span>
                            New to SmartPlacement?
                        </span>

                        <a href="/register">
                            Create an account
                        </a>

                    </div>


                    <div className="security-note">
                        🔒 Your account information is securely protected.
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;