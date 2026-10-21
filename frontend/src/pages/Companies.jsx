import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/apiClient";

function Companies() {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

        useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await api.get(
                    "/api/placements"
                );

                const drives = response.data.drives || [];

                const uniqueCompanies = [];

                drives.forEach((drive) => {
                    const existingCompany = uniqueCompanies.find(
                        (company) =>
                            company.name.toLowerCase() ===
                            drive.companyName.toLowerCase()
                    );

                    if (!existingCompany) {
                        uniqueCompanies.push({
                            name: drive.companyName,
                            industry: "Technology & IT",
                            location: drive.jobLocation || "Not specified",
                            roles: 1,
                            package: `₹${drive.package} LPA`,
                            status: drive.status === "open"
                                ? "Hiring"
                                : drive.status
                        });
                    } else {
                        existingCompany.roles += 1;
                    }
                });

                setCompanies(uniqueCompanies);

            } catch (error) {
                console.error(
                    "Companies Error:",
                    error
                );

                setError(
                    "Unable to load companies."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="companies-layout">

            {/* SIDEBAR */}

            <aside className="companies-sidebar">

                <div className="companies-brand">
                    <div className="companies-brand-logo">
                        LP
                    </div>

                    <div>
                        <h2>LaunchPath</h2>
                        <span>Career Platform</span>
                    </div>
                </div>

                <nav className="companies-nav">

                    <button onClick={() => navigate("/dashboard")}>
                        🏠
                        <span>Dashboard</span>
                    </button>

                    <button onClick={() => navigate("/profile")}>
                        👤
                        <span>My Profile</span>
                    </button>

                    <button className="active">
                        🏢
                        <span>Companies</span>
                    </button>

                    <button onClick={() => navigate("/placements")}>
                        📢
                        <span>Placement Drives</span>
                    </button>

                    <button onClick={() => navigate("/skill-gap")}>
                        🎯
                        <span>Skill Gap</span>
                    </button>

                    <button onClick={() => navigate("/preparation")}>
                        📚
                        <span>Preparation</span>
                    </button>

                    <button onClick={() => navigate("/analytics")}>
                        📊
                        <span>Analytics</span>
                    </button>

                </nav>

                <button
                    className="companies-logout"
                    onClick={handleLogout}
                >
                    ↪
                    <span>Logout</span>
                </button>

            </aside>


            {/* MAIN CONTENT */}

            <main className="companies-main">

                <div className="companies-header">

                    <div>
                        <p className="dashboard-label">
                            CAREER OPPORTUNITIES
                        </p>

                        <h1>Companies</h1>

                        <p>
                            Explore companies and discover placement
                            opportunities available through LaunchPath.
                        </p>
                    </div>

                </div>


                {/* SUMMARY */}

                <div className="companies-summary">

                    <div className="company-summary-card">
                        <span>Companies</span>
                        <strong>{companies.length}</strong>
                    </div>

                    <div className="company-summary-card">
                        <span>Active Hiring</span>
                        <strong>{companies.length}</strong>
                    </div>

                    <div className="company-summary-card">
                        <span>Open Roles</span>
                        <strong>
                            {companies.reduce(
                                (total, company) =>
                                    total + company.roles,
                                0
                            )}
                        </strong>
                    </div>

                    <div className="company-summary-card">
                        <span>Top Package</span>
                        <strong>₹8 LPA</strong>
                    </div>

                </div>


                {/* COMPANY LIST */}

                <section className="companies-section">

                    <div className="companies-section-header">

                        <div>
                            <h2>Hiring Companies</h2>

                            <p>
                                Companies currently available for
                                placement opportunities.
                            </p>
                        </div>

                    </div>

                    {error && (
                        <div style={{ margin: "16px 0", padding: "12px 16px", borderRadius: "8px", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div style={{ padding: "40px 0", textAlign: "center", color: "#64748b" }}>
                            Loading companies...
                        </div>
                    ) : (
                        <div className="company-grid">

                        {companies.map((company, index) => (

                            <div
                                className="company-card"
                                key={index}
                            >

                                <div className="company-card-top">

                                    <div className="company-logo">
                                        {company.name
                                            .substring(0, 2)
                                            .toUpperCase()}
                                    </div>

                                    <span className="company-status">
                                        ● {company.status}
                                    </span>

                                </div>


                                <h3>{company.name}</h3>

                                <p className="company-industry">
                                    {company.industry}
                                </p>


                                <div className="company-details">

                                    <div>
                                        <span>Location</span>
                                        <strong>
                                            📍 {company.location}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Open Roles</span>
                                        <strong>
                                            {company.roles}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Package</span>
                                        <strong>
                                            {company.package}
                                        </strong>
                                    </div>

                                </div>


                                <button
                                    className="company-view-button"
                                    onClick={() =>
                                        navigate("/placements")
                                    }
                                >
                                    View Opportunities
                                    <span>→</span>
                                </button>

                            </div>

                        ))}

                    </div>
                    )}

                </section>

            </main>

        </div>
    );
}

export default Companies;