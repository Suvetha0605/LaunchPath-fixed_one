import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/apiClient";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts";

function Analytics() {
    const navigate = useNavigate();

    const [drives, setDrives] = useState([]);
    const [selectedDriveId, setSelectedDriveId] = useState("");
    const [loading, setLoading] = useState(true);
    const [readinessLoading, setReadinessLoading] = useState(false);
    const [readinessNotice, setReadinessNotice] = useState("");

    const [readiness, setReadiness] = useState({
        overall: 0,
        academic: 0,
        eligibility: 0,
        technical: 0,
        level: "",
        recommendation: "",
        matchedSkills: 0,
        totalSkills: 0,
        missingSkills: []
    });

    const userRole = (() => {
        try {
            const parsedUser = JSON.parse(localStorage.getItem("user") || "null");
            return parsedUser?.role || "";
        } catch {
            return "";
        }
    })();
    const token = localStorage.getItem("token");
    const isAdmin = userRole === "admin";

    const adminNotice = isAdmin
        ? "You are signed in as an Administrator. Readiness analysis is calculated per student profile. Platform placement statistics are shown below."
        : "";
    const displayNotice = adminNotice || readinessNotice;

    // 1. Fetch drives
    useEffect(() => {
        const fetchDrives = async () => {
            try {
                const response = await api.get("/api/placements");
                const placementDrives = response.data.drives || [];
                setDrives(placementDrives);

                if (placementDrives.length > 0) {
                    setSelectedDriveId(placementDrives[0]._id);
                }
            } catch (error) {
                console.error("Analytics fetch drives error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDrives();
    }, []);

    // 2. Fetch readiness whenever selectedDriveId changes
    useEffect(() => {
        if (!selectedDriveId || !token || isAdmin) return;

        const fetchReadiness = async () => {
            setReadinessLoading(true);
            setReadinessNotice("");

            try {
                const eligibilityResponse = await api.get(
                    `/api/placements/${selectedDriveId}/eligibility`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = eligibilityResponse.data;

                if (data.readiness) {
                    const r = data.readiness;
                    setReadiness({
                        overall: r.overallReadiness ?? 0,
                        academic: r.academicReadiness ?? 0,
                        eligibility: r.eligibilityReadiness ?? 0,
                        technical: r.technicalSkillReadiness ?? 0,
                        level: r.readinessLevel || "In Progress",
                        recommendation: r.recommendation || "",
                        matchedSkills: r.matchedSkills ?? 0,
                        totalSkills: r.totalSkills ?? 0,
                        missingSkills: r.missingSkills || []
                    });
                }

                if (data.eligibility?.overallStatus === "profile_incomplete") {
                    setReadinessNotice(
                        "Your student profile is incomplete. Complete your academic details (CGPA, department) and skills in My Profile to calculate accurate readiness scores."
                    );
                }
            } catch (error) {
                console.error("Readiness calculation error:", error);
                const msg =
                    error.response?.data?.message ||
                    "Unable to calculate readiness for this drive. Please ensure your profile is up to date.";
                setReadinessNotice(msg);
                setReadiness({
                    overall: 0,
                    academic: 0,
                    eligibility: 0,
                    technical: 0,
                    level: "Incomplete",
                    recommendation: "Update your profile with CGPA, department, and technical skills.",
                    matchedSkills: 0,
                    totalSkills: 0,
                    missingSkills: []
                });
            } finally {
                setReadinessLoading(false);
            }
        };

        fetchReadiness();
    }, [selectedDriveId, token, isAdmin]);

    const chartData = useMemo(() => [
        {
            name: "Academic Readiness",
            shortName: "Academic",
            score: readiness.academic,
            color: "#2563eb",
            description: "CGPA, active backlogs, percentage, and graduation year match"
        },
        {
            name: "Eligibility Criteria",
            shortName: "Eligibility",
            score: readiness.eligibility,
            color: "#10b981",
            description: "Compliance with all drive eligibility requirements"
        },
        {
            name: "Technical Skills",
            shortName: "Technical",
            score: readiness.technical,
            color: "#8b5cf6",
            description: "Percentage of required skills in student profile"
        }
    ], [readiness.academic, readiness.eligibility, readiness.technical]);

    const highestPackage =
        drives.length > 0
            ? Math.max(...drives.map((drive) => Number(drive.package) || 0))
            : 0;

    const selectedDrive = drives.find((d) => d._id === selectedDriveId);

    const getLevelBadgeStyle = (level) => {
        const l = level?.toLowerCase();
        if (l === "excellent") return { background: "#dcfce7", color: "#166534" };
        if (l === "good") return { background: "#dbeafe", color: "#1e40af" };
        if (l === "needs improvement") return { background: "#fef3c7", color: "#92400e" };
        return { background: "#fee2e2", color: "#991b1b" };
    };

    const isDriveExpired = (drive) => {
        if (!drive?.applicationDeadline) return false;
        return new Date() > new Date(drive.applicationDeadline);
    };

    return (
        <div className="analytics-layout">
            {/* Sidebar */}
            <aside className="analytics-sidebar">
                <div className="analytics-brand">
                    <div className="brand-logo">LP</div>
                    <div>
                        <h2>LaunchPath</h2>
                        <p>{isAdmin ? "Admin Portal" : "Career Platform"}</p>
                    </div>
                </div>

                <nav className="analytics-nav">
                    {isAdmin ? (
                        <>
                            <button
                                className="nav-item"
                                onClick={() => navigate("/admin/dashboard")}
                            >
                                <span>🏠</span>
                                Dashboard
                            </button>
                            <button
                                className="nav-item"
                                onClick={() => navigate("/admin/applications")}
                            >
                                <span>📝</span>
                                Applications
                            </button>
                            <button
                                className="nav-item"
                                onClick={() => navigate("/admin/placements")}
                            >
                                <span>📢</span>
                                Placement Drives
                            </button>
                            <button className="nav-item active">
                                <span>📊</span>
                                Analytics
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className="nav-item"
                                onClick={() => navigate("/dashboard")}
                            >
                                <span>🏠</span>
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
                            <button className="nav-item active">
                                <span>📊</span>
                                Analytics
                            </button>
                        </>
                    )}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="analytics-main">
                <div className="analytics-header">
                    <div>
                        <p className="dashboard-label">PLACEMENT INTELLIGENCE</p>
                        <h1>Analytics</h1>
                        <p>
                            Understand readiness benchmarks, requirement formulas, and active placement opportunities.
                        </p>
                    </div>
                </div>

                {/* Top Statistics Cards */}
                <section className="analytics-stats">
                    <div className="analytics-stat-card">
                        <span>Overall Readiness</span>
                        <strong style={{ color: "#2563eb" }}>
                            {isAdmin ? "—" : `${readiness.overall}%`}
                        </strong>
                        <small>
                            {isAdmin
                                ? "Student-specific metric"
                                : readiness.level
                                ? `Readiness: ${readiness.level}`
                                : "Readiness benchmark"}
                        </small>
                    </div>

                    <div className="analytics-stat-card">
                        <span>Companies</span>
                        <strong>
                            {new Set(
                                drives.map((d) => d.companyName?.trim().toLowerCase())
                            ).size}
                        </strong>
                        <small>Active corporate partners</small>
                    </div>

                    <div className="analytics-stat-card">
                        <span>Placement Drives</span>
                        <strong>{drives.length}</strong>
                        <small>
                            {drives.filter(
                                (d) =>
                                    d.status === "open" &&
                                    (!d.applicationDeadline ||
                                        new Date(d.applicationDeadline) >= new Date())
                            ).length}{" "}
                            currently accepting applications
                        </small>
                    </div>

                    <div className="analytics-stat-card">
                        <span>Highest Package</span>
                        <strong style={{ color: "#0f766e" }}>
                            ₹{highestPackage} LPA
                        </strong>
                        <small>Top available opportunity</small>
                    </div>
                </section>

                {/* Notice / Informative Explanations */}
                {displayNotice && (
                    <div
                        style={{
                            padding: "16px 20px",
                            marginBottom: "22px",
                            borderRadius: "12px",
                            background: isAdmin ? "#eff6ff" : "#fffbeb",
                            border: `1px solid ${isAdmin ? "#bfdbfe" : "#fde68a"}`,
                            color: isAdmin ? "#1e40af" : "#92400e",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "12px",
                            flexWrap: "wrap"
                        }}
                    >
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <span style={{ fontSize: "20px" }}>ℹ️</span>
                            <span style={{ fontSize: "14px", lineHeight: "1.5" }}>
                                {displayNotice}
                            </span>
                        </div>
                        {!isAdmin && (
                            <button
                                onClick={() => navigate("/profile")}
                                style={{
                                    padding: "8px 14px",
                                    background: "#2563eb",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "8px",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    cursor: "pointer"
                                }}
                            >
                                Update Profile →
                            </button>
                        )}
                    </div>
                )}

                {/* Drive Selector for Contextual Readiness */}
                {!isAdmin && drives.length > 0 && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            marginBottom: "20px",
                            flexWrap: "wrap",
                            background: "#ffffff",
                            padding: "14px 20px",
                            borderRadius: "12px",
                            border: "1px solid #e5e7eb"
                        }}
                    >
                        <label
                            htmlFor="drive-select"
                            style={{ fontSize: "14px", fontWeight: "600", color: "#334155" }}
                        >
                            Select Placement Drive for Analysis:
                        </label>
                        <select
                            id="drive-select"
                            value={selectedDriveId}
                            onChange={(e) => setSelectedDriveId(e.target.value)}
                            style={{
                                padding: "8px 12px",
                                borderRadius: "8px",
                                border: "1px solid #cbd5e1",
                                fontSize: "14px",
                                background: "#fff",
                                color: "#1e293b",
                                fontWeight: "500",
                                outline: "none",
                                minWidth: "260px"
                            }}
                        >
                            {drives.map((d) => (
                                <option key={d._id} value={d._id}>
                                  {d.companyName} — {d.jobRole} (₹{d.package} LPA)
                                </option>
                            ))}
                        </select>
                        {readinessLoading && (
                            <span style={{ fontSize: "12px", color: "#64748b" }}>
                                Computing readiness...
                            </span>
                        )}
                    </div>
                )}

                {/* Readiness Breakdown Section */}
                {!isAdmin && (
                    <section className="analytics-panel">
                        <div className="analytics-panel-header" style={{ flexWrap: "wrap", gap: "16px" }}>
                            <div>
                                <p className="section-label">READINESS BREAKDOWN</p>
                                <h2>
                                    Readiness Analysis:{" "}
                                    {selectedDrive?.companyName || "Placement Target"}
                                </h2>
                                <p>
                                    Calculated using the verified LaunchPath placement algorithm:
                                    equal weighting across Academic, Eligibility, and Technical skill readiness.
                                </p>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                {readiness.level && (
                                    <span
                                        style={{
                                            padding: "6px 14px",
                                            borderRadius: "9999px",
                                            fontSize: "13px",
                                            fontWeight: "700",
                                            ...getLevelBadgeStyle(readiness.level)
                                        }}
                                    >
                                        {readiness.level}
                                    </span>
                                )}
                                <div className="analytics-overall">
                                    <strong>{readiness.overall}%</strong>
                                    <span>Overall</span>
                                </div>
                            </div>
                        </div>

                        {/* Documented Formula Details Box */}
                        <div
                            style={{
                                margin: "16px 0 20px",
                                padding: "12px 16px",
                                background: "#f8fafc",
                                border: "1px solid #e2e8f0",
                                borderRadius: "10px",
                                fontSize: "12px",
                                color: "#475569",
                                lineHeight: "1.6"
                            }}
                        >
                            <strong>Formula Breakdown: </strong>
                            Overall Readiness = Math.round((Academic Readiness + Eligibility Readiness + Technical Readiness) / 3).
                            <br />
                            • <strong>Academic ({readiness.academic}%):</strong> Percentage of academic criteria passed (CGPA, backlogs, percentage, graduation year).
                            <br />
                            • <strong>Eligibility ({readiness.eligibility}%):</strong> Percentage of all criteria satisfied for this drive.
                            <br />
                            • <strong>Technical ({readiness.technical}%):</strong> Matched skills ({readiness.matchedSkills}) out of total required skills ({readiness.totalSkills}).
                        </div>

                        {/* Recharts Bar Chart */}
                        <div className="readiness-chart" style={{ minWidth: 0 }}>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#64748b"
                                        fontSize={12}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        domain={[0, 100]}
                                        stroke="#64748b"
                                        fontSize={12}
                                        tickLine={false}
                                        tickFormatter={(v) => `${v}%`}
                                    />
                                    <Tooltip
                                        formatter={(val, name, item) => [
                                            `${val}%`,
                                            item.payload.name
                                        ]}
                                        labelFormatter={() => "Dimension Score"}
                                        contentStyle={{
                                            background: "#1e293b",
                                            color: "#fff",
                                            borderRadius: "8px",
                                            border: "none",
                                            fontSize: "12px"
                                        }}
                                    />
                                    <Bar dataKey="score" radius={[8, 8, 0, 0]} maxBarSize={60}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Recommendation Note */}
                        {readiness.recommendation && (
                            <div
                                style={{
                                    marginTop: "20px",
                                    padding: "14px 18px",
                                    borderRadius: "10px",
                                    background: "#f0fdf4",
                                    border: "1px solid #bbf7d0",
                                    color: "#166534",
                                    fontSize: "13px"
                                }}
                            >
                                <strong>💡 Recommendation: </strong>
                                {readiness.recommendation}
                            </div>
                        )}
                    </section>
                )}

                {/* Score Cards Grid */}
                {!isAdmin && (
                    <section className="analytics-score-grid">
                        <div className="analytics-score-card">
                            <div className="score-icon">🎓</div>
                            <div>
                                <span>Academic Readiness</span>
                                <strong>{readiness.academic}%</strong>
                            </div>
                            <small style={{ color: "#64748b", fontSize: "11px", display: "block", marginTop: "4px" }}>
                                Evaluated against CGPA, backlogs, & batch requirements
                            </small>
                            <div className="score-progress">
                                <div style={{ width: `${readiness.academic}%`, background: "#2563eb" }}></div>
                            </div>
                        </div>

                        <div className="analytics-score-card">
                            <div className="score-icon">✅</div>
                            <div>
                                <span>Eligibility Readiness</span>
                                <strong>{readiness.eligibility}%</strong>
                            </div>
                            <small style={{ color: "#64748b", fontSize: "11px", display: "block", marginTop: "4px" }}>
                                Overall criteria compliance for selected opportunity
                            </small>
                            <div className="score-progress">
                                <div style={{ width: `${readiness.eligibility}%`, background: "#10b981" }}></div>
                            </div>
                        </div>

                        <div className="analytics-score-card">
                            <div className="score-icon">💻</div>
                            <div>
                                <span>Technical Readiness</span>
                                <strong>{readiness.technical}%</strong>
                            </div>
                            <small style={{ color: "#64748b", fontSize: "11px", display: "block", marginTop: "4px" }}>
                                {readiness.matchedSkills} of {readiness.totalSkills} required skills matched
                            </small>
                            <div className="score-progress">
                                <div style={{ width: `${readiness.technical}%`, background: "#8b5cf6" }}></div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Opportunity Overview Table */}
                <section className="analytics-panel">
                    <div className="analytics-panel-header">
                        <div>
                            <p className="section-label">OPPORTUNITY OVERVIEW</p>
                            <h2>Available Campus Drives</h2>
                            <p>Current placement drives with active deadlines and requirements.</p>
                        </div>
                        <button
                            onClick={() => navigate(isAdmin ? "/admin/placements" : "/placements")}
                            style={{
                                padding: "8px 14px",
                                background: "#315ec8",
                                color: "#fff",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "13px",
                                fontWeight: "600",
                                cursor: "pointer"
                            }}
                        >
                            View All Drives →
                        </button>
                    </div>

                    <div style={{ overflowX: "auto", marginTop: "18px" }}>
                        <div className="opportunity-table">
                            <div className="table-header">
                                <span>Company</span>
                                <span>Role</span>
                                <span>Package</span>
                                <span>Status / Deadline</span>
                            </div>

                            {loading ? (
                                <div className="analytics-loading">Loading opportunities...</div>
                            ) : drives.length === 0 ? (
                                <div className="analytics-loading">No placement drives found.</div>
                            ) : (
                                drives.slice(0, 8).map((drive) => {
                                    const expired = isDriveExpired(drive);
                                    return (
                                        <div className="table-row" key={drive._id}>
                                            <strong>{drive.companyName}</strong>
                                            <span>{drive.jobRole}</span>
                                            <span style={{ fontWeight: "600", color: "#0f766e" }}>
                                                ₹{drive.package} LPA
                                            </span>
                                            <div>
                                                <span
                                                    style={{
                                                        display: "inline-block",
                                                        padding: "2px 8px",
                                                        borderRadius: "4px",
                                                        fontSize: "11px",
                                                        fontWeight: "600",
                                                        background:
                                                            drive.status === "open" && !expired
                                                                ? "#ecfdf3"
                                                                : "#f1f5f9",
                                                        color:
                                                            drive.status === "open" && !expired
                                                                ? "#027a48"
                                                                : "#475569"
                                                    }}
                                                >
                                                    {drive.status}
                                                </span>
                                                {expired && (
                                                    <span
                                                        style={{
                                                            marginLeft: "6px",
                                                            fontSize: "11px",
                                                            color: "#dc2626",
                                                            fontWeight: "600"
                                                        }}
                                                    >
                                                        (Deadline Passed)
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Analytics;