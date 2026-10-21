import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/apiClient";
import "./MyApplications.css";

function MyApplications() {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        let isMounted = true;
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        const loadApplications = async () => {
            try {
                const response = await api.get("/api/applications/my", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!isMounted) return;
                setApplications(response.data.applications || []);
                setError("");
            } catch (err) {
                if (!isMounted) return;
                console.error("Fetch Applications Error:", err);
                setError(
                    err.response?.data?.message ||
                    "Unable to load your applications."
                );
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadApplications();

        return () => {
            isMounted = false;
        };
    }, [navigate]);

    const handleRetry = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const response = await api.get("/api/applications/my", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setApplications(response.data.applications || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load your applications."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const formatDate = (date) => {
        if (!date) return "—";
        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const getCompanyInitials = (name) => {
        if (!name) return "CO";
        const cleanName = name.trim();
        const parts = cleanName.split(/\s+/);
        if (parts.length === 1) {
            return cleanName.substring(0, 2).toUpperCase();
        }
        return (parts[0][0] + parts[1][0]).toUpperCase();
    };

    const getStatusBadgeClass = (status) => {
        const s = (status || "").toLowerCase();
        if (s === "pending") return "pending";
        if (s === "selected") return "selected";
        if (s === "rejected") return "rejected";
        if (s === "shortlisted") return "shortlisted";
        return "default";
    };

    // Filter applications by status and search query
    const filteredApplications = useMemo(() => {
        const q = searchTerm.trim().toLowerCase();
        return applications.filter((app) => {
            const companyName = app.placementDrive?.companyName?.toLowerCase() || "";
            const jobRole = app.placementDrive?.jobRole?.toLowerCase() || "";
            const status = (app.status || "Pending").toLowerCase();

            const matchesSearch =
                !q || companyName.includes(q) || jobRole.includes(q);
            const matchesStatus =
                statusFilter === "all" || status === statusFilter.toLowerCase();

            return matchesSearch && matchesStatus;
        });
    }, [applications, searchTerm, statusFilter]);

    // Metric counts
    const pendingCount = applications.filter(
        (a) => (a.status || "Pending").toLowerCase() === "pending"
    ).length;
    const shortlistedCount = applications.filter(
        (a) => (a.status || "").toLowerCase() === "shortlisted"
    ).length;
    const selectedCount = applications.filter(
        (a) => (a.status || "").toLowerCase() === "selected"
    ).length;

    return (
        <div className="applications-layout">
            {/* SIDEBAR NAVIGATION */}
            <aside className="applications-sidebar">
                <div className="applications-brand">
                    <div className="applications-brand-logo">LP</div>
                    <div>
                        <h2>LaunchPath</h2>
                        <span>Career Platform</span>
                    </div>
                </div>

                <nav className="applications-nav">
                    <button onClick={() => navigate("/dashboard")}>
                        <span>🏠</span>
                        <span>Dashboard</span>
                    </button>

                    <button onClick={() => navigate("/profile")}>
                        <span>👤</span>
                        <span>My Profile</span>
                    </button>

                    <button onClick={() => navigate("/companies")}>
                        <span>🏢</span>
                        <span>Companies</span>
                    </button>

                    <button onClick={() => navigate("/placements")}>
                        <span>📢</span>
                        <span>Placement Drives</span>
                    </button>

                    <button className="active">
                        <span>📝</span>
                        <span>My Applications</span>
                    </button>

                    <button onClick={() => navigate("/skill-gap")}>
                        <span>🎯</span>
                        <span>Skill Gap</span>
                    </button>

                    <button onClick={() => navigate("/preparation")}>
                        <span>📚</span>
                        <span>Preparation</span>
                    </button>

                    <button onClick={() => navigate("/analytics")}>
                        <span>📊</span>
                        <span>Analytics</span>
                    </button>
                </nav>

                <button className="applications-logout" onClick={handleLogout}>
                    <span>↪</span>
                    <span>Logout</span>
                </button>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="applications-main">
                {/* TOP HEADER & DASHBOARD BACK LINK */}
                <div className="applications-top-bar">
                    <button
                        className="applications-back-btn"
                        onClick={() => navigate("/dashboard")}
                    >
                        ← Back to Dashboard
                    </button>

                    <button
                        className="app-view-drives-btn"
                        onClick={() => navigate("/placements")}
                    >
                        Browse Placement Drives →
                    </button>
                </div>

                <div className="applications-header">
                    <p className="applications-label">STUDENT CAREER TRACKER</p>
                    <h1>My Applications</h1>
                    <p>
                        Track your submitted campus placement applications, status updates,
                        and recruitment progress in one unified view.
                    </p>
                </div>

                {/* ERROR STATE */}
                {error && (
                    <div className="applications-error-banner">
                        <span>⚠️ {error}</span>
                        <button className="app-retry-btn" onClick={handleRetry}>
                            ↺ Retry
                        </button>
                    </div>
                )}

                {/* LOADING STATE */}
                {loading ? (
                    <div className="applications-loading-box">
                        <div className="app-spinner"></div>
                        <p>Loading your placement applications...</p>
                    </div>
                ) : applications.length === 0 ? (
                    /* EMPTY STATE (NO APPLICATIONS OVERALL) */
                    <div className="applications-empty-box">
                        <div className="app-empty-icon">📋</div>
                        <h2>No Applications Submitted Yet</h2>
                        <p>
                            You haven't submitted applications for any campus placement drives yet.
                            Explore active opportunities, check your eligibility, and apply to launch
                            your career.
                        </p>
                        <button
                            className="app-primary-btn"
                            onClick={() => navigate("/placements")}
                        >
                            Browse Placement Drives →
                        </button>
                    </div>
                ) : (
                    <>
                        {/* SUMMARY METRICS CARDS */}
                        <div className="applications-metrics-grid">
                            <div className="app-metric-card">
                                <span>Total Applied</span>
                                <strong>{applications.length}</strong>
                            </div>

                            <div className="app-metric-card highlight-pending">
                                <span>Under Review</span>
                                <strong>{pendingCount}</strong>
                            </div>

                            <div className="app-metric-card highlight-shortlisted">
                                <span>Shortlisted</span>
                                <strong>{shortlistedCount}</strong>
                            </div>

                            <div className="app-metric-card highlight-selected">
                                <span>Selected / Offers</span>
                                <strong>{selectedCount}</strong>
                            </div>
                        </div>

                        {/* SEARCH & STATUS FILTER BAR */}
                        <div className="applications-filter-bar">
                            <div className="app-filter-chips">
                                {["all", "Pending", "Shortlisted", "Selected", "Rejected"].map(
                                    (st) => (
                                        <button
                                            key={st}
                                            className={`app-filter-chip ${
                                                statusFilter.toLowerCase() === st.toLowerCase()
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() => setStatusFilter(st)}
                                        >
                                            {st === "all" ? "All Applications" : st}
                                        </button>
                                    )
                                )}
                            </div>

                            <input
                                type="text"
                                className="app-search-input"
                                placeholder="Search by company or role..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* FILTERED LIST OR EMPTY SEARCH RESULTS */}
                        {filteredApplications.length === 0 ? (
                            <div className="applications-empty-box" style={{ padding: "40px 20px" }}>
                                <h3>No applications match your criteria</h3>
                                <p>
                                    Try selecting a different status filter or clearing your search query.
                                </p>
                                <button
                                    className="app-primary-btn"
                                    onClick={() => {
                                        setStatusFilter("all");
                                        setSearchTerm("");
                                    }}
                                >
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <div className="applications-list">
                                {filteredApplications.map((application) => {
                                    const drive = application.placementDrive;
                                    const status = application.status || "Pending";
                                    const companyName = drive?.companyName || "Unknown Company";
                                    const jobRole = drive?.jobRole || "Placement Opportunity";
                                    const badgeClass = getStatusBadgeClass(status);

                                    return (
                                        <article
                                            key={application._id}
                                            className="application-card"
                                        >
                                            {/* CARD HEADER: LOGO, COMPANY NAME, JOB ROLE, STATUS */}
                                            <div className="app-card-header">
                                                <div className="app-company-info">
                                                    <div className="app-company-logo">
                                                        {getCompanyInitials(companyName)}
                                                    </div>
                                                    <div className="app-titles">
                                                        <h3 className="app-company-name">
                                                            {companyName}
                                                        </h3>
                                                        <p className="app-job-role">{jobRole}</p>
                                                    </div>
                                                </div>

                                                <span
                                                    className={`app-status-badge ${badgeClass}`}
                                                >
                                                    ● {status}
                                                </span>
                                            </div>

                                            {/* PLACEMENT DETAILS (ONLY RENDERED WHEN AVAILABLE IN RESPONSE) */}
                                            <div className="app-details-strip">
                                                {drive?.package !== undefined &&
                                                    drive?.package !== null && (
                                                        <span className="app-detail-pill package">
                                                            💰 ₹{drive.package} LPA
                                                        </span>
                                                    )}

                                                {drive?.jobLocation && (
                                                    <span className="app-detail-pill location">
                                                        📍 {drive.jobLocation}
                                                    </span>
                                                )}

                                                {drive?.status && (
                                                    <span className="app-detail-pill">
                                                        📢 Drive: {drive.status.toUpperCase()}
                                                    </span>
                                                )}

                                                <span className="app-detail-pill applied-date">
                                                    📅 Applied on {formatDate(application.appliedAt)}
                                                </span>
                                            </div>

                                            {/* CARD FOOTER & ACTION */}
                                            <div className="app-card-footer">
                                                <p className="app-applied-text">
                                                    Application ID:{" "}
                                                    <code style={{ fontSize: "11px", color: "#64748b" }}>
                                                        {application._id}
                                                    </code>
                                                </p>

                                                <button
                                                    className="app-view-drives-btn"
                                                    onClick={() => navigate("/placements")}
                                                >
                                                    View Placement Drives →
                                                </button>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

export default MyApplications;
