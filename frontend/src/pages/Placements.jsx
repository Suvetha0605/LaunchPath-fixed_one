import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/apiClient";

function Placements() {
    const navigate = useNavigate();

    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [eligibilityResult, setEligibilityResult] = useState(null);
    const [eligibilityLoading, setEligibilityLoading] = useState(false);
    
const [applyingDriveId, setApplyingDriveId] = useState(null);
const [applicationMessage, setApplicationMessage] = useState("");
const [appliedDriveIds, setAppliedDriveIds] = useState([]);


    useEffect(() => {
        const fetchDrives = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await api.get(
                    "/api/placements",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setDrives(response.data.drives || []);

            } catch (error) {
                console.error("Placement Error:", error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load placement drives."
                );
            } finally {
                setLoading(false);
            }
        };
        
        fetchDrives();
    }, [navigate]);
    useEffect(() => {
    const fetchMyApplications = async () => {
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

            const ids = (response.data.applications || [])
                .map((application) => {
                    const drive = application.placementDrive;
                    return typeof drive === "string" ? drive : drive?._id;
                })
                .filter(Boolean);

            setAppliedDriveIds(ids);
        } catch (error) {
            console.error("Fetch Applications Error:", error);
        }
    };

    fetchMyApplications();
}, []);



    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };


// ADD THIS FUNCTION HERE

const handleCheckEligibility = async (driveId) => {
    const token = localStorage.getItem("token");

    if (!token) {
        navigate("/login");
        return;
    }

    setEligibilityLoading(true);
    setEligibilityResult(null);

    try {
        const response = await api.get(
            `/api/placements/${driveId}/eligibility`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setEligibilityResult(response.data);

    } catch (error) {
        console.error("Eligibility Error:", error);

        setEligibilityResult({
            error:
                error.response?.data?.message ||
                "Unable to analyze eligibility."
        });

    } finally {
        setEligibilityLoading(false);
    }
};

const isDriveExpired = (drive) => {
    if (!drive?.applicationDeadline) return false;
    return new Date() > new Date(drive.applicationDeadline);
};

const isDriveAccepting = (drive) => {
    return drive?.status?.toLowerCase() === "open" && !isDriveExpired(drive);
};

const handleApply = async (driveId) => {
    const token = localStorage.getItem("token");

    if (!token) {
        navigate("/login");
        return;
    }

    if (appliedDriveIds.includes(driveId)) {
        setApplicationMessage("You have already applied for this drive.");
        return;
    }

    const targetDrive = drives.find((d) => d._id === driveId);
    if (targetDrive && isDriveExpired(targetDrive)) {
        setApplicationMessage(
            "Applications are closed because the application deadline has passed."
        );
        return;
    }

    if (targetDrive && targetDrive.status !== "open") {
        setApplicationMessage(
            `Applications cannot be submitted because this drive is ${targetDrive.status}.`
        );
        return;
    }

    setApplyingDriveId(driveId);
    setApplicationMessage("");

    try {
        const response = await api.post(
            "/api/applications",
            { driveId },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setAppliedDriveIds((previous) => [...previous, driveId]);
        setApplicationMessage(response.data.message || "Application submitted successfully!");
    } catch (error) {
        setApplicationMessage(
            error.response?.data?.message || "Failed to submit application."
        );
    } finally {
        setApplyingDriveId(null);
    }
};


    const formatDate = (date) => {
        if (!date) return "TBA";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    if (loading) {
        return (
            <div className="placements-loading">
                <div className="loading-spinner"></div>
                <p>Finding placement opportunities...</p>
            </div>
        );
    }

    return (
        <div className="placements-page">

            {/* Sidebar */}
            <aside className="placements-sidebar">

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

                    <button className="nav-item active">
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

            {/* Main */}
            <main className="placements-main">

                <header className="placements-header">

                    <div>
                        <p className="dashboard-label">
                            CAREER OPPORTUNITIES
                        </p>

                        <h1>Placement Drives</h1>

                        <p className="dashboard-subtitle">
                            Discover opportunities that match your
                            academic profile and skills.
                        </p>
                    </div>

                    <div className="placement-summary">
                        <span className="summary-number">
                            {drives.length}
                        </span>

                        <span>
                            Active Opportunities
                        </span>
                    </div>

                </header>

                {/* Intro Banner */}
                <section className="placement-banner">

                    <div className="banner-icon">
                        ✦
                    </div>

                    <div>
                        <h2>
                            Find opportunities built for your profile.
                        </h2>

                        <p>
                            LaunchPath will compare your academic
                            details and skills with company
                            requirements.
                        </p>
                    </div>

                </section>

                {/* Error */}
                {error && (
                    <div className="placement-error">
                        <strong>Unable to load drives</strong>
                        <span>{error}</span>
                    </div>
                )}

                {/* Drives */}
                {applicationMessage && (
    <p role="status">{applicationMessage}</p>
)}
                <section className="placement-list">

                    <div className="placement-section-header">

                        <div>
                            <h2>Available Opportunities</h2>
                            <p>
                                Placement drives currently available
                                for students.
                            </p>
                        </div>

                    </div>

                    {drives.length === 0 ? (
                        <div className="no-drives">
                            <div>📭</div>

                            <h3>No placement drives available</h3>

                            <p>
                                New opportunities will appear here
                                when they are published.
                            </p>
                        </div>
                    ) : (
                        <div className="drive-cards">

                            {drives.map((drive) => (
                                <div
                                    className="placement-card"
                                    key={drive._id}
                                >

                                    {/* Company */}
                                    <div className="placement-card-top">

                                        <div className="company-avatar">
                                            {drive.companyName
                                                ?.charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div className="company-details">

                                            <h3>
                                                {drive.companyName}
                                            </h3>

                                            <p>
                                                {drive.jobRole}
                                            </p>

                                        </div>

                                        <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
                                            <span
                                                className={`drive-status ${drive.status}`}
                                            >
                                                {drive.status}
                                            </span>
                                            {isDriveExpired(drive) && (
                                                <span
                                                    className="drive-status"
                                                    style={{
                                                        background: "#fee2e2",
                                                        color: "#991b1b",
                                                        border: "1px solid #fecaca"
                                                    }}
                                                >
                                                    Deadline Passed
                                                </span>
                                            )}
                                        </div>

                                    </div>

                                    {/* Main information */}
                                    <div className="drive-info-grid">

                                        <div className="drive-info-box">
                                            <span>💰</span>

                                            <div>
                                                <small>
                                                    Package
                                                </small>

                                                <strong>
                                                    ₹{drive.package} LPA
                                                </strong>
                                            </div>
                                        </div>

                                        <div className="drive-info-box">
                                            <span>📍</span>

                                            <div>
                                                <small>
                                                    Location
                                                </small>

                                                <strong>
                                                    {drive.jobLocation ||
                                                        "Not specified"}
                                                </strong>
                                            </div>
                                        </div>

                                        <div className="drive-info-box">
                                            <span>📅</span>

                                            <div>
                                                <small>
                                                    Drive Date
                                                </small>

                                                <strong>
                                                    {formatDate(
                                                        drive.driveDate
                                                    )}
                                                </strong>
                                            </div>
                                        </div>

                                        <div className="drive-info-box">
                                            <span>⏳</span>

                                            <div>
                                                <small>
                                                    Apply Before
                                                </small>

                                                <strong style={isDriveExpired(drive) ? { color: "#dc2626" } : {}}>
                                                    {formatDate(
                                                        drive.applicationDeadline
                                                    )} {isDriveExpired(drive) && "(Passed)"}
                                                </strong>
                                            </div>
                                        </div>

                                    </div>

                                    {/* Requirements */}
                                    <div className="drive-requirements">

                                        <h4>
                                            Basic Eligibility
                                        </h4>

                                        <div className="requirement-row">

                                            <span>
                                                CGPA ≥{" "}
                                                {drive.minimumCGPA}
                                            </span>

                                            <span>
                                                {drive.allowedDepartments?.join(
                                                    " • "
                                                )}
                                            </span>

                                            <span>
                                                Batch{" "}
                                                {drive.graduationYear}
                                            </span>

                                            <span>
                                                Max Backlogs:{" "}
                                                {drive.maximumBacklogs}
                                            </span>

                                        </div>

                                    </div>

                                    {/* Skills */}
                                    <div className="required-skills">

                                        <div className="skills-title">
                                            <h4>
                                                Required Skills
                                            </h4>

                                            <span>
                                                {
                                                    drive.requiredSkills
                                                        ?.length || 0
                                                }{" "}
                                                skills
                                            </span>
                                        </div>

                                        <div className="drive-skill-list">

                                            {drive.requiredSkills?.map(
                                                (skill, index) => (
                                                    <span
                                                        key={index}
                                                    >
                                                        {skill}
                                                    </span>
                                                )
                                            )}

                                        </div>

                                    </div>

                                    {/* Footer */}
                                    <div className="placement-card-footer">

                                        <div className="openings">

                                            <strong>
                                                {drive.openings}
                                            </strong>

                                            <span>
                                                Open Positions
                                            </span>

                                        </div>

                                        <button
    className="eligibility-button"
    onClick={() =>
        handleCheckEligibility(drive._id)
    }
    disabled={eligibilityLoading}
>
    {eligibilityLoading
        ? "Analyzing..."
        : "Check Eligibility"}

    {!eligibilityLoading && <span>→</span>}
</button>

<button
    className="eligibility-button"
    onClick={() => handleApply(drive._id)}
    disabled={
        !isDriveAccepting(drive) ||
        applyingDriveId === drive._id ||
        appliedDriveIds.includes(drive._id)
    }
    style={
        !isDriveAccepting(drive) && !appliedDriveIds.includes(drive._id)
            ? { opacity: 0.65, cursor: "not-allowed", background: "#64748b" }
            : {}
    }
    title={
        appliedDriveIds.includes(drive._id)
            ? "You have already applied"
            : isDriveExpired(drive)
            ? "Deadline has passed"
            : drive.status !== "open"
            ? `Drive is ${drive.status}`
            : "Apply for this drive"
    }
>
    {appliedDriveIds.includes(drive._id)
        ? "Applied ✓"
        : isDriveExpired(drive)
        ? "Deadline Passed"
        : drive.status !== "open"
        ? `Drive ${drive.status}`
        : applyingDriveId === drive._id
        ? "Applying..."
        : "Apply Now"}
</button>


                                    </div>

                                </div>
                            ))}

                        </div>
                    )}

                {eligibilityResult && (
                    <div className="eligibility-result-card">

                        {eligibilityResult.error ? (
                            <div className="eligibility-error">
                                <h3>Eligibility Analysis Failed</h3>
                                <p>{eligibilityResult.error}</p>
                            </div>
                        ) : (
                            <>
                                <div className="eligibility-result-header">
                                    <div>
                                        <p className="dashboard-label">
                                            SMART ELIGIBILITY ANALYSIS
                                        </p>

                                        <h2>
                                            {eligibilityResult.drive?.companyName}
                                        </h2>

                                        <p>
                                            {eligibilityResult.drive?.jobRole}
                                        </p>
                                    </div>

                                    <div
                                        className={`eligibility-status ${eligibilityResult.eligibility?.overallStatus}`}
                                    >
                                        {eligibilityResult.eligibility?.overallStatus === "eligible"
                                            ? "✓ Eligible"
                                            : eligibilityResult.eligibility?.overallStatus === "profile_incomplete"
                                            ? "⚠ Profile Incomplete"
                                            : "✕ Not Eligible"}
                                    </div>
                                </div>

                                <div className="eligibility-score">
                                    <div>
                                        <span>Eligibility Match</span>

                                        <strong>
                                            {eligibilityResult.eligibility?.readinessPercentage}%
                                        </strong>
                                    </div>

                                    <div className="score-bar">
                                        <div
                                            style={{
                                                width: `${eligibilityResult.eligibility?.readinessPercentage || 0}%`
                                            }}
                                        ></div>
                                    </div>
                                </div>
                                

    {/* PLACEMENT READINESS */}

    {eligibilityResult?.readiness && (
        <div className="placement-readiness-section">

            <div className="placement-readiness-header">
                <div>
                    <p className="dashboard-label">
                        PLACEMENT INTELLIGENCE
                    </p>

                    <h3>Placement Readiness</h3>

                    <p>
                        Your overall readiness for this placement opportunity.
                    </p>
                </div>

                <div className="readiness-score-circle">
                    <strong>
                        {eligibilityResult.readiness.overallReadiness}%
                    </strong>

                    <span>
                        {eligibilityResult.readiness.readinessLevel}
                    </span>
                </div>
            </div>

            <div className="readiness-metrics">

                <div className="readiness-metric">
                    <div className="readiness-metric-top">
                        <span>Academic Readiness</span>
                        <strong>
                            {eligibilityResult.readiness.academicReadiness}%
                        </strong>
                    </div>

                    <div className="readiness-progress">
                        <div
                            style={{
                                width: `${eligibilityResult.readiness.academicReadiness}%`
                            }}
                        ></div>
                    </div>
                </div>

                <div className="readiness-metric">
                    <div className="readiness-metric-top">
                        <span>Eligibility Readiness</span>
                        <strong>
                            {eligibilityResult.readiness.eligibilityReadiness}%
                        </strong>
                    </div>

                    <div className="readiness-progress">
                        <div
                            style={{
                                width: `${eligibilityResult.readiness.eligibilityReadiness}%`
                            }}
                        ></div>
                    </div>
                </div>

                <div className="readiness-metric">
                    <div className="readiness-metric-top">
                        <span>Technical Skill Readiness</span>
                        <strong>
                            {eligibilityResult.readiness.technicalSkillReadiness}%
                        </strong>
                    </div>

                    <div className="readiness-progress">
                        <div
                            style={{
                                width: `${eligibilityResult.readiness.technicalSkillReadiness}%`
                            }}
                        ></div>
                    </div>
                </div>

            </div>

            <div className="readiness-summary">

                <div className="readiness-summary-item">
                    <strong>
                        {eligibilityResult.readiness.matchedSkills}/
                        {eligibilityResult.readiness.totalSkills}
                    </strong>
                    <span>Skills Matched</span>
                </div>

                <div className="readiness-summary-item">
                    <strong>
                        {eligibilityResult.readiness.missingSkills?.length || 0}
                    </strong>
                    <span>Skills to Improve</span>
                </div>

                <div className="readiness-summary-item">
                    <strong>
                        {eligibilityResult.readiness.readinessLevel}
                    </strong>
                    <span>Readiness Level</span>
                </div>

            </div>

            <div className="readiness-recommendation">
                <strong>💡 Recommendation</strong>

                <p>
                    {eligibilityResult.readiness.recommendation}
                </p>
            </div>

        </div>
    )}

    <div className="eligibility-summary">

                                    <div className="eligibility-stat passed">
                                        <strong>
                                            {eligibilityResult.eligibility?.passedCriteria}
                                        </strong>
                                        <span>Passed</span>
                                    </div>

                                    <div className="eligibility-stat failed">
                                        <strong>
                                            {eligibilityResult.eligibility?.failedCriteria}
                                        </strong>
                                        <span>Failed</span>
                                    </div>

                                    <div className="eligibility-stat missing">
                                        <strong>
                                            {eligibilityResult.eligibility?.missingCriteria}
                                        </strong>
                                        <span>Missing Info</span>
                                    </div>

                                </div>

                                <div className="eligibility-checks">

                                    <h3>Eligibility Breakdown</h3>

                                    {eligibilityResult.eligibility?.checks?.map(
                                        (check, index) => (
                                            <div
                                                className="eligibility-check"
                                                key={index}
                                            >
                                                <div>
                                                    <strong>
                                                        {check.criterion}
                                                    </strong>

                                                    <small>
                                                        Required: {check.required}
                                                    </small>

                                                    <small>
                                                        Your Value: {check.studentValue}
                                                    </small>
                                                </div>

                                                <span
                                                    className={`check-status ${check.status}`}
                                                >
                                                    {check.status === "passed"
                                                        ? "✓ Passed"
                                                        : check.status === "failed"
                                                        ? "✕ Failed"
                                                        : "⚠ Missing"}
                                                </span>
                                            </div>
                                        )
                                    )}

                                </div>

                                {eligibilityResult.eligibility?.missingSkills?.length > 0 && (
                                    <div className="missing-skills-box">

                                        <h3>🎯 Skills to Improve</h3>

                                        <p>
                                            These required skills are missing
                                            from your profile:
                                        </p>

                                        <div className="missing-skill-list">
                                            {eligibilityResult.eligibility.missingSkills.map(
                                                (skill, index) => (
                                                    <span key={index}>
                                                        {skill}
                                                    </span>
                                                )
                                            )}
                                        </div>

                                    </div>
                                )}

                            </>
                        )}

                    </div>
                )}
                {eligibilityResult?.skillGap?.skillGaps?.length > 0 && (
    <div className="skill-gap-section">

        <div className="skill-gap-header">
            <div>
                <p className="dashboard-label">
                    PERSONALIZED DEVELOPMENT
                </p>

                <h3>Skill Gap Analysis</h3>

                <p>
                    Improve the skills required for this
                    placement opportunity.
                </p>
            </div>

            <div className="skill-gap-count">
                {eligibilityResult.skillGap.missingSkillsCount}
                <span>Skill Gap</span>
            </div>
        </div>

        {eligibilityResult.skillGap.skillGaps.map(
            (gap, index) => (
                <div
                    className="skill-gap-card"
                    key={index}
                >

                    <div className="skill-gap-card-header">
                        <div>
                            <span className="skill-gap-icon">
                                🎯
                            </span>

                            <div>
                                <h4>{gap.skill}</h4>

                                <span className="importance-badge">
                                    {gap.importance} Priority
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="skill-gap-reason">
                        <strong>Why this skill matters</strong>

                        <p>{gap.reason}</p>
                    </div>

                    <div className="skill-gap-roadmap">

                        <h4>Recommended Learning Roadmap</h4>

                        <div className="roadmap-list">
                            {gap.roadmap.map(
                                (step, stepIndex) => (
                                    <div
                                        className="roadmap-step"
                                        key={stepIndex}
                                    >
                                        <span>
                                            {stepIndex + 1}
                                        </span>

                                        <p>{step}</p>
                                    </div>
                                )
                            )}
                        </div>

                    </div>

                    <div className="beginner-topics">

                        <h4>Beginner Topics</h4>

                        <div className="topic-list">
                            {gap.beginnerTopics.map(
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

    </div>
)}

                </section>

            </main>

        </div>
    );
}

export default Placements;