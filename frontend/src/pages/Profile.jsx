import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/apiClient";

function Profile() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);

const [editForm, setEditForm] = useState({
    name: "",
    registerNumber: "",
    department: "",
    cgpa: "",
    percentage: "",
    backlogs: "",
    graduationYear: "",
    skills: ""
});

const [saveMessage, setSaveMessage] = useState("");
const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await api.get(
                    "/api/profile",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setUser(response.data.user);
            } catch (error) {
                console.error("Profile Error:", error);

                if (error.response?.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    navigate("/login");
                    return;
                }

                setError(
                    error.response?.data?.message ||
                    "Unable to load profile."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);
const handleEditProfile = () => {
    setEditForm({
        name: user?.name || "",
        registerNumber: user?.registerNumber || "",
        department: user?.department || "",
        cgpa: user?.cgpa ?? "",
        percentage: user?.percentage ?? "",
        backlogs: user?.backlogs ?? "",
        graduationYear: user?.graduationYear ?? "",
        skills: user?.skills?.join(", ") || ""
    });

    setSaveMessage("");
    setIsEditing(true);
};


const handleSaveProfile = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
        navigate("/login");
        return;
    }

    try {
        setSaving(true);
        setSaveMessage("");

        const response = await api.put(
            "/api/profile",
            {
                name: editForm.name,
                registerNumber: editForm.registerNumber,
                department: editForm.department,
                cgpa: Number(editForm.cgpa),
                percentage: Number(editForm.percentage),
                backlogs: Number(editForm.backlogs),
                graduationYear: Number(editForm.graduationYear),
                skills: editForm.skills
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter(Boolean)
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setUser((prev) => ({
            ...prev,
            ...response.data.user
        }));

        setIsEditing(false);
        setSaveMessage("Profile updated successfully.");
    } catch (error) {
        console.error("Profile Update Error:", error);

        setSaveMessage(
            error.response?.data?.message ||
            "Unable to update profile."
        );
    } finally {
        setSaving(false);
    }
};
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="profile-loading">
                <div className="loading-spinner"></div>
                <p>Loading your profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-error">
                <div className="error-card">
                    <h2>Unable to Load Profile</h2>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">

            {/* Sidebar */}
            <aside className="profile-sidebar">

                <div className="dashboard-brand">
                    <div className="dashboard-logo">LP</div>

                    <div>
                        <h2>LaunchPath</h2>
                        <p>Career Platform</p>
                    </div>
                </div>

                <nav className="dashboard-nav">

                    <button
                        className="nav-item"
                        onClick={() => navigate("/dashboard")}
                    >
                        <span>⌂</span>
                        Dashboard
                    </button>

                    <button className="nav-item active">
                        <span>👤</span>
                        My Profile
                    </button>

                    <button
    className="nav-item"
    onClick={() => navigate("/companies")}
>
    <span>🏢</span>
    Companies
</button>

                    <button
    className="nav-item"
    onClick={() => navigate("/placements")}
>
    <span>📢</span>
    Placement Drives
</button>

                    <button
    className="nav-item"
    onClick={() => navigate("/skill-gap")}
>
    <span>🎯</span>
    Skill Gap
</button>

                    <button
    className="nav-item"
    onClick={() => navigate("/preparation")}
>
    <span>📚</span>
    Preparation
</button>

                    <button
    className="nav-item"
    onClick={() => navigate("/analytics")}
>
    <span>📊</span>
    Analytics
</button>

                </nav>

                <div className="sidebar-bottom">

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        <span>↪</span>
                        Logout
                    </button>

                </div>

            </aside>

            {/* Main Content */}
            <main className="profile-main">

                <header className="profile-header">

                    <div>
                        <p className="dashboard-label">
                            STUDENT PROFILE
                        </p>

                        <h1>My Profile</h1>

                        <p className="dashboard-subtitle">
                            Manage your academic and career information.
                        </p>
                    </div>

                    <div className="profile-mini">

                        <div className="profile-avatar">
                            {user?.name
                                ? user.name.charAt(0).toUpperCase()
                                : "S"}
                        </div>

                        <div>
                            <strong>
                                {user?.name || "Student"}
                            </strong>

                            <small>
                                {user?.role || "student"}
                            </small>
                        </div>

                    </div>

                </header>

                {/* Profile Hero */}
                <section className="profile-hero-card">

                    <div className="profile-large-avatar">
                        {user?.name
                            ? user.name.charAt(0).toUpperCase()
                            : "S"}
                    </div>

                    <div className="profile-hero-info">

                        <h2>{user?.name || "Student"}</h2>

                        <p>{user?.email}</p>

                        <div className="profile-tags">

                            <span>
                                🎓 Student
                            </span>

                            {user?.department && (
                                <span>
                                    {user.department}
                                </span>
                            )}

                        </div>

                    </div>

                    <div className="profile-status">
                        <span className="status-dot"></span>
                        Profile Active
                    </div>

                </section>

                {/* Personal Information */}
                <section className="profile-section">

                    <div className="section-heading">
                        <div>
                            <h2>Personal Information</h2>
                            <p>Your registered account details.</p>
                        </div>
                    </div>

                    <div className="profile-info-grid">

                        <div className="info-item">
                            <span className="info-icon">👤</span>

                            <div>
                                <label>Full Name</label>
                                <strong>
                                    {user?.name || "Not provided"}
                                </strong>
                            </div>
                        </div>

                        <div className="info-item">
                            <span className="info-icon">✉</span>

                            <div>
                                <label>Email Address</label>
                                <strong>
                                    {user?.email || "Not provided"}
                                </strong>
                            </div>
                        </div>

                        <div className="info-item">
                            <span className="info-icon">🪪</span>

                            <div>
                                <label>Register Number</label>
                                <strong>
                                    {user?.registerNumber ||
                                        "Not provided"}
                                </strong>
                            </div>
                        </div>

                        <div className="info-item">
                            <span className="info-icon">🏛</span>

                            <div>
                                <label>Department</label>
                                <strong>
                                    {user?.department ||
                                        "Not provided"}
                                </strong>
                            </div>
                        </div>

                    </div>

                </section>

                {/* Academic Information */}
                <section className="profile-section">

                    <div className="section-heading">
                        <div>
                            <h2>Academic Information</h2>
                            <p>Your academic performance details.</p>
                        </div>
                    </div>

                    <div className="academic-grid">

                        <div className="academic-card">

                            <span className="academic-icon blue">
                                CG
                            </span>

                            <div>
                                <label>CGPA</label>

                                <strong>
                                    {user?.cgpa ?? "Not provided"}
                                </strong>

                                <small>Out of 10.0</small>
                            </div>

                        </div>

                        <div className="academic-card">

                            <span className="academic-icon purple">
                                🎓
                            </span>

                            <div>
                                <label>Graduation Year</label>

                                <strong>
                                    {user?.graduationYear ||
                                        "Not provided"}
                                </strong>

                                <small>Expected graduation</small>
                            </div>

                        </div>

                        <div className="academic-card">

                            <span className="academic-icon green">
                                ✓
                            </span>

                            <div>
                                <label>Account Role</label>

                                <strong>
                                    {user?.role || "student"}
                                </strong>

                                <small>LaunchPath account</small>
                            </div>

                        </div>

                    </div>

                </section>

                {/* Skills */}
                <section className="profile-section">

                    <div className="section-heading">
                        <div>
                            <h2>Technical Skills</h2>
                            <p>
                                Skills added to your placement profile.
                            </p>
                        </div>

                        <span className="skill-count">
                            {user?.skills?.length || 0} Skills
                        </span>
                    </div>

                    <div className="skills-container">

                        {user?.skills?.length > 0 ? (
                            user.skills.map((skill, index) => (
                                <span
                                    className="skill-pill"
                                    key={index}
                                >
                                    {skill}
                                </span>
                            ))
                        ) : (
                            <div className="empty-skills">
                                <span>🎯</span>

                                <div>
                                    <strong>
                                        No skills added yet
                                    </strong>

                                    <p>
                                        Add your technical skills
                                        to improve your placement
                                        opportunities.
                                    </p>
                                </div>
                            </div>
                        )}

                    </div>

                </section>

{/* Edit Profile Form */}
{isEditing && (
    <section className="profile-section">
        <div className="section-heading">
            <div>
                <h2>Edit Profile</h2>
                <p>Update your academic and career information.</p>
            </div>
        </div>

        <form onSubmit={handleSaveProfile}>
            <div className="profile-info-grid">
                <div className="info-item">
                    <label>Full Name</label>
                    <input
                        required
                        value={editForm.name}
                        onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                        }
                    />
                </div>

                <div className="info-item">
                    <label>Register Number</label>
                    <input
                        value={editForm.registerNumber}
                        onChange={(e) =>
                            setEditForm({ ...editForm, registerNumber: e.target.value })
                        }
                    />
                </div>

                <div className="info-item">
                    <label>Department</label>
                    <input
                        value={editForm.department}
                        onChange={(e) =>
                            setEditForm({ ...editForm, department: e.target.value })
                        }
                    />
                </div>

                <div className="info-item">
                    <label>CGPA</label>
                    <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.01"
                        value={editForm.cgpa}
                        onChange={(e) =>
                            setEditForm({ ...editForm, cgpa: e.target.value })
                        }
                    />
                </div>

                <div className="info-item">
                    <label>Percentage</label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={editForm.percentage}
                        onChange={(e) =>
                            setEditForm({ ...editForm, percentage: e.target.value })
                        }
                    />
                </div>

                <div className="info-item">
                    <label>Active Backlogs</label>
                    <input
                        type="number"
                        min="0"
                        step="1"
                        value={editForm.backlogs}
                        onChange={(e) =>
                            setEditForm({ ...editForm, backlogs: e.target.value })
                        }
                    />
                </div>

                <div className="info-item">
                    <label>Graduation Year</label>
                    <input
                        type="number"
                        min="2020"
                        max="2100"
                        value={editForm.graduationYear}
                        onChange={(e) =>
                            setEditForm({ ...editForm, graduationYear: e.target.value })
                        }
                    />
                </div>

                <div className="info-item">
                    <label>Technical Skills (comma-separated)</label>
                    <input
                        placeholder="Java, SQL, React"
                        value={editForm.skills}
                        onChange={(e) =>
                            setEditForm({ ...editForm, skills: e.target.value })
                        }
                    />
                </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                <button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={saving}
                >
                    Cancel
                </button>
            </div>

            {saveMessage && <p role="status">{saveMessage}</p>}
        </form>
    </section>
)}

                {/* Profile Completion */}
                <section className="profile-completion">

                    <div>

                        <span className="completion-icon">
                            ✓
                        </span>

                        <div>
                            <h3>Keep your profile updated</h3>

                            <p>
                                A complete profile helps you discover
                                relevant placement opportunities.
                            </p>
                        </div>

                    </div>

                   
<button onClick={handleEditProfile}>
    Edit Profile →
</button>


                </section>

            </main>

        </div>
    );
}

export default Profile;