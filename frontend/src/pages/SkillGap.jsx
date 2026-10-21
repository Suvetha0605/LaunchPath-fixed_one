import { useEffect, useState } from "react";
import api from "../api/apiClient";
import { useNavigate } from "react-router-dom";

function SkillGap() {
    const navigate = useNavigate();

    const [skillData, setSkillData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [drives, setDrives] = useState([]);
    const [noDrives, setNoDrives] = useState(false);
    const [selectedDriveId, setSelectedDriveId] = useState("");

useEffect(() => {
    const fetchDrives = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const response = await api.get(
                "/api/placements"
            );

            const placementDrives = response.data.drives || [];

            setDrives(placementDrives);

            if (placementDrives.length === 0) {
                setNoDrives(true);
                setError("");
                setLoading(false);
                return;
            }

            setNoDrives(false);
            const savedDriveId = localStorage.getItem("selectedDriveId");
            const initialDrive = placementDrives.find((drive) => drive._id === savedDriveId)
                || placementDrives[0];
            setSelectedDriveId(initialDrive._id);
        } catch (error) {
            console.error("Placement Drives Error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to load placement drives."
            );

            setLoading(false);
        }
    };

    fetchDrives();
}, [navigate]);
useEffect(() => {
    const fetchSkillGap = async () => {
        if (!selectedDriveId) {
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const eligibilityResponse = await api.get(
                `/api/placements/${selectedDriveId}/eligibility`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSkillData({
                drive: eligibilityResponse.data.drive,
                skillGap: eligibilityResponse.data.skillGap,
                readiness: eligibilityResponse.data.readiness
            });
        } catch (error) {
            console.error("Skill Gap Error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to load skill gap analysis."
            );
        } finally {
            setLoading(false);
        }
    };

    fetchSkillGap();
}, [selectedDriveId, navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="skill-page-loading">
                Loading Skill Gap Analysis...
            </div>
        );
    }

    return (
        <div className="skill-gap-layout">

            {/* SIDEBAR */}

            <aside className="skill-sidebar">

                <div className="skill-brand">
                    <div className="skill-brand-logo">
                        LP
                    </div>

                    <div>
                        <h2>LaunchPath</h2>
                        <span>Career Platform</span>
                    </div>
                </div>

                <nav className="skill-nav">

                    <button
                        onClick={() => navigate("/dashboard")}
                    >
                        🏠
                        <span>Dashboard</span>
                    </button>

                    <button
                        onClick={() => navigate("/profile")}
                    >
                        👤
                        <span>My Profile</span>
                    </button>

                    <button
                        onClick={() => navigate("/companies")}
                    >
                        🏢
                        <span>Companies</span>
                    </button>

                    <button
                        onClick={() => navigate("/placements")}
                    >
                        📢
                        <span>Placement Drives</span>
                    </button>

                    <button className="active">
                        🎯
                        <span>Skill Gap</span>
                    </button>

                    <button
                        onClick={() => navigate("/preparation")}
                    >
                        📚
                        <span>Preparation</span>
                    </button>

                    <button
                        onClick={() => navigate("/analytics")}
                    >
                        📊
                        <span>Analytics</span>
                    </button>

                </nav>

                <button
                    className="skill-logout"
                    onClick={handleLogout}
                >
                    ↪
                    <span>Logout</span>
                </button>

            </aside>


            {/* MAIN CONTENT */}

            <main className="skill-main">

                <div className="skill-header">

                    <div>
                        <p className="dashboard-label">
                            PLACEMENT INTELLIGENCE
                        </p>

                        <h1>Skill Gap Analysis</h1>

                        <p>
                            Identify the skills you need to improve
                            for your target placement opportunities.
                        </p>
                    </div>
<div className="skill-company-selector">
    <label>Target Company</label>

    <select
        disabled={drives.length === 0}
        value={selectedDriveId}
        onChange={(e) => {
    const driveId = e.target.value;
    setSelectedDriveId(driveId);
    localStorage.setItem("selectedDriveId", driveId);
}}
    >
        {drives.map((drive) => (
            <option key={drive._id} value={drive._id}>
                {drive.companyName} — {drive.jobRole}
            </option>
        ))}
    </select>
</div>
                    <button
                        className="skill-back-button"
                        onClick={() => navigate("/placements")}
                    >
                        ← Placement Drives
                    </button>

                </div>


                {noDrives ? (
                    <section className="skill-section" role="status">
                        <h2>No placement drives available yet</h2>
                        <p>
                            Skill gap analysis compares your profile skills with a placement drive’s requirements.
                            Once an admin adds a drive, you can select it here to see matched skills and a learning roadmap.
                        </p>
                        <button
                            className="skill-back-button"
                            onClick={() => navigate("/placements")}
                        >
                            Browse Placement Drives
                        </button>
                    </section>
                ) : error ? (

                    <div className="skill-error" role="alert">
                        <h3>Unable to load Skill Gap Analysis</h3>
                        <p>{error}</p>
                        <button onClick={() => window.location.reload()}>
                            Try again
                        </button>
                    </div>

                ) : (

                    <>

                        {/* OVERVIEW */}

                        <section className="skill-overview">

                            <div className="skill-overview-card">

                                <span>Total Required Skills</span>

                                <strong>
                                    {skillData?.skillGap?.totalRequiredSkills || 0}
                                </strong>

                            </div>

                            <div className="skill-overview-card">

                                <span>Skills Matched</span>

                                <strong>
                                    {skillData?.skillGap?.matchedSkillsCount || 0}
                                </strong>

                            </div>

                            <div className="skill-overview-card">

                                <span>Skills to Improve</span>

                                <strong className="skill-warning-number">
                                    {skillData?.skillGap?.missingSkillsCount || 0}
                                </strong>

                            </div>

                            <div className="skill-overview-card">

                                <span>Technical Readiness</span>

                                <strong>
                                    {skillData?.readiness?.technicalSkillReadiness || 0}%
                                </strong>

                            </div>

                        </section>


                        {/* TARGET ROLE */}

                        <section className="target-role-card">

                            <div>

                                <p className="dashboard-label">
                                    TARGET OPPORTUNITY
                                </p>

                                <h2>
                                    {skillData?.drive?.jobRole}
                                </h2>

                                <p>
                                    {skillData?.drive?.companyName}
                                    {" • "}
                                    {skillData?.drive?.jobLocation}
                                </p>

                            </div>

                            <div className="target-role-package">
                                ₹{skillData?.drive?.package} LPA
                            </div>

                        </section>


                        {/* MATCHED SKILLS */}

                        <section className="skill-section">

                            <div className="skill-section-title">

                                <div>
                                    <h2>Skills You Already Have</h2>

                                    <p>
                                        These skills match the current
                                        placement requirements.
                                    </p>
                                </div>

                                <span className="matched-count">
                                    {skillData?.skillGap?.matchedSkillsCount || 0}
                                    {" "}Matched
                                </span>

                            </div>

                            <div className="skill-chip-list">

                                {skillData?.skillGap?.matchedSkills?.map(
                                    (skill, index) => (
                                        <span
                                            className="matched-skill-chip"
                                            key={index}
                                        >
                                            ✓ {skill}
                                        </span>
                                    )
                                )}

                            </div>

                        </section>


                        {/* MISSING SKILLS */}

                        <section className="skill-section">

                            <div className="skill-section-title">

                                <div>
                                    <h2>Skills to Improve</h2>

                                    <p>
                                        These skills are required for
                                        the selected placement opportunity.
                                    </p>
                                </div>

                                <span className="missing-count">
                                    {skillData?.skillGap?.missingSkillsCount || 0}
                                    {" "}Gap
                                </span>

                            </div>


                            {skillData?.skillGap?.skillGaps?.map(
                                (gap, index) => (

                                    <div
                                        className="skill-roadmap-card"
                                        key={index}
                                    >

                                        <div className="skill-roadmap-header">

                                            <div className="skill-title-area">

                                                <div className="skill-icon">
                                                    🎯
                                                </div>

                                                <div>

                                                    <h3>
                                                        {gap.skill}
                                                    </h3>

                                                    <span className="priority-badge">
                                                        {gap.importance} Priority
                                                    </span>

                                                </div>

                                            </div>

                                        </div>


                                        <div className="skill-reason">

                                            <strong>
                                                Why this skill matters
                                            </strong>

                                            <p>
                                                {gap.reason}
                                            </p>

                                        </div>


                                        <div className="roadmap-area">

                                            <h4>
                                                Recommended Learning Roadmap
                                            </h4>

                                            <div className="roadmap-items">

                                                {gap.roadmap?.map(
                                                    (step, stepIndex) => (

                                                        <div
                                                            className="roadmap-item"
                                                            key={stepIndex}
                                                        >

                                                            <span>
                                                                {stepIndex + 1}
                                                            </span>

                                                            <p>
                                                                {step}
                                                            </p>

                                                        </div>

                                                    )
                                                )}

                                            </div>

                                        </div>


                                        <div className="beginner-area">

                                            <h4>
                                                Beginner Topics
                                            </h4>

                                            <div className="beginner-chip-list">

                                                {gap.beginnerTopics?.map(
                                                    (topic, topicIndex) => (

                                                        <span key={topicIndex}>
                                                            {topic}
                                                        </span>

                                                    )
                                                )}

                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                        </section>

                    </>

                )}

            </main>

        </div>
    );
}

export default SkillGap;