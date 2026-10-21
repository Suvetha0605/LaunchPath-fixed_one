import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/apiClient";

function Dashboard() {
    const navigate = useNavigate();

    const [user] = useState(() => {
        try {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        } catch {
            return null;
        }
    });
    const [drives, setDrives] = useState([]);
const [eligibleCount, setEligibleCount] = useState(0);
const [applicationsCount, setApplicationsCount] = useState(0);
const [loadingDrives, setLoadingDrives] = useState(true);

const [skillsCount, setSkillsCount] = useState(0);

const isDriveExpired = (drive) => {
    if (!drive?.applicationDeadline) return false;
    return new Date() > new Date(drive.applicationDeadline);
};

const activeDrivesCount = drives.filter(
    (d) => d.status === "open" && !isDriveExpired(d)
).length;

useEffect(() => {
    const fetchProfileSkills = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await api.get(
                "/api/profile",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const profile = response.data.user || response.data.profile;
            setSkillsCount(profile?.skills?.length || 0);
        } catch (error) {
            console.error("Profile Skills Error:", error);
        }
    };

    fetchProfileSkills();
}, []);


    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
        }
    }, [navigate]);
    
useEffect(() => {
    const fetchApplicationsCount = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const response = await api.get(
                "/api/applications/my",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setApplicationsCount(response.data.count || 0);
        } catch (error) {
            console.error("Applications Count Error:", error);
        }
    };

    fetchApplicationsCount();
}, []);

useEffect(() => {
    const fetchDashboardData = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setLoadingDrives(true);

            const response = await api.get(
                "/api/placements"
            );

            const placementDrives = response.data.drives || [];

            setDrives(placementDrives);

            let eligible = 0;

            const results = await Promise.all(
                placementDrives.map(async (drive) => {
                    try {
                        const result = await api.get(
                            `/api/placements/${drive._id}/eligibility`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            }
                        );

                        return result.data.eligibility?.overallStatus === "eligible";
                    } catch {
                        return false;
                    }
                })
            );

            eligible = results.filter(Boolean).length;
            setEligibleCount(eligible);

        } catch (error) {
            console.error("Dashboard Data Error:", error);
        } finally {
            setLoadingDrives(false);
        }
    };

    fetchDashboardData();
}, [navigate]);
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <div className="dashboard-page">

            {/* SIDEBAR */}

            <aside className="dashboard-sidebar">

                <div className="dashboard-brand">
                    <div className="dashboard-logo">
                        LP
                    </div>

                    <div>
                        <h2>LaunchPath</h2>
                        <p>Career Platform</p>
                    </div>
                </div>


                <nav className="dashboard-nav">

                    <button
    className="nav-item active"
    onClick={() => navigate("/dashboard")}
>
    <span>⌂</span>
    Dashboard
</button>

<button
    className="nav-item"
    onClick={() => navigate("/profile")}
>
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
    onClick={() => navigate("/my-applications")}
>
    <span>📝</span>
    My Applications
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


            {/* MAIN CONTENT */}

            <main className="dashboard-main">

                {/* TOP BAR */}

                <header className="dashboard-header">

                    <div>
                        <p className="dashboard-label">
                            STUDENT DASHBOARD
                        </p>

                        <h1>
                            Welcome back,
                            <span>
                                {" "}
                                {user?.name || "Student"} 👋
                            </span>
                        </h1>

                        <p className="dashboard-subtitle">
                            Here's your placement journey at a glance.
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


                {/* OVERVIEW CARDS */}

                <section className="dashboard-cards">

                    <div className="overview-card">

                        <div className="card-icon blue">
                            📢
                        </div>

                        <div>
                            <p>Active Drives</p>
                            <h2>{loadingDrives ? "..." : activeDrivesCount}</h2>
                            <small>Accepting applications</small>
                        </div>

                    </div>


                    <div className="overview-card">

                        <div className="card-icon green">
                            ✓
                        </div>

                        <div>
                            <p>Eligible Drives</p>
                            <h2>{loadingDrives ? "..." : eligibleCount}</h2>
                            <small>Based on your profile</small>
                        </div>

                    </div>


                    <div
                        className="overview-card"
                        onClick={() => navigate("/my-applications")}
                        style={{ cursor: "pointer" }}
                        title="View My Applications"
                    >

                        <div className="card-icon purple">
                            📝
                        </div>

                        <div>
                            <p>Applications</p>
                            <h2>{applicationsCount}</h2>
                            <small>Applications submitted</small>
                        </div>

                    </div>


                    <div className="overview-card">

                        <div className="card-icon orange">
                            🎯
                        </div>

                        <div>
                            <p>Skills Added</p>
                            <h2>
                                {skillsCount}
                            </h2>
                            <small>Technical skills</small>
                        </div>

                    </div>

                </section>


                {/* CONTENT GRID */}

                <section className="dashboard-grid">

                    {/* UPCOMING DRIVES */}

                    <div className="dashboard-panel">

                        <div className="panel-header">

                            <div>
                                <h2>Upcoming Placement Drives</h2>
                                <p>
                                    Explore opportunities available
                                    for students.
                                </p>
                            </div>

                            <button onClick={() => navigate("/placements")}>
                                View All →
                            </button>

                        </div>


                        
<div className="drive-list">
    {loadingDrives ? (
        <p>Loading placement drives...</p>
    ) : drives.length === 0 ? (
        <p>No placement drives available.</p>
    ) : (
        drives.slice(0, 3).map((drive) => {
            const driveDate = new Date(drive.driveDate);

            return (
                <div className="drive-item" key={drive._id}>
                    <div className="company-logo">
                        {drive.companyName?.charAt(0).toUpperCase()}
                    </div>

                    <div className="drive-info">
                        <strong>{drive.companyName}</strong>
                        <span>{drive.jobRole}</span>
                    </div>

                    <div className="drive-date">
                        <strong>
                            {Number.isNaN(driveDate.getTime())
                                ? "--"
                                : driveDate.getDate()}
                        </strong>
                        <span>
                            {Number.isNaN(driveDate.getTime())
                                ? "---"
                                : driveDate.toLocaleString("en-US", {
                                      month: "short"
                                  }).toUpperCase()}
                        </span>
                    </div>

                    <button
                        className="apply-btn"
                        onClick={() => navigate("/placements")}
                    >
                        View
                    </button>
                </div>
            );
        })
    )}
</div>


                    </div>


                    {/* PROFILE COMPLETION */}

                    <div className="dashboard-panel profile-progress">

                        <div className="panel-header">

                            <div>
                                <h2>Profile Progress</h2>
                                <p>
                                    Complete your profile
                                </p>
                            </div>

                        </div>


                        <div className="progress-circle">
                            <div>
                                <strong>70%</strong>
                                <span>Complete</span>
                            </div>
                        </div>


                        <p className="progress-text">
                            Add more academic and skill details
                            to improve your placement profile.
                        </p>

                        <button className="complete-profile">
                            Complete Profile →
                        </button>

                    </div>

                </section>


                {/* QUICK ACTIONS */}

                <section className="quick-section">

                    <div className="quick-header">
                        <h2>Quick Actions</h2>
                        <p>
                            Manage your placement preparation.
                        </p>
                    </div>


                    <div className="quick-grid">

                        <button className="quick-card">
                            <span>✓</span>
                            <strong>Check Eligibility</strong>
                            <small>
                                Find drives you qualify for
                            </small>
                        </button>

                        <button className="quick-card">
                            <span>🎯</span>
                            <strong>Analyze Skills</strong>
                            <small>
                                Discover your skill gaps
                            </small>
                        </button>

                        <button className="quick-card">
                            <span>📚</span>
                            <strong>Start Preparation</strong>
                            <small>
                                Track your preparation
                            </small>
                        </button>

                        <button className="quick-card">
                            <span>📊</span>
                            <strong>View Analytics</strong>
                            <small>
                                Understand your progress
                            </small>
                        </button>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default Dashboard;