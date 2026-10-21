
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/apiClient";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || user?.role !== "admin") {
      navigate("/login", { replace: true });
      return;
    }

    const fetchApplications = async () => {
      try {
        const response = await api.get(
          "/api/applications",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = response.data;
        setApplications(
          Array.isArray(data)
            ? data
            : data.applications || data.data || []
        );
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load applications. Please check the backend."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [navigate, token, user?.role]);

  const total = applications.length;
  const shortlisted = applications.filter(
    (app) => app.status?.toLowerCase() === "shortlisted"
  ).length;
  const pending = applications.filter(
    (app) => app.status?.toLowerCase() === "pending"
  ).length;
  const rejected = applications.filter(
    (app) => app.status?.toLowerCase() === "rejected"
  ).length;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2 className="admin-brand">LP LaunchPath</h2>
        <p className="admin-subtitle">Admin Portal</p>

        <button className="nav-active" onClick={() => navigate("/admin/dashboard")}>
          Dashboard
        </button>
        <button onClick={() => navigate("/admin/applications")}>
          Applications
        </button>
        <button onClick={() => navigate("/admin/placements")}>
          Placement Drives
        </button>
        <button onClick={() => navigate("/analytics")}>
          Analytics
        </button>

        <button className="admin-logout" onClick={logout}>
          Logout
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <p className="admin-eyebrow">ADMINISTRATION</p>
            <h1>Admin Dashboard</h1>
            <p>Monitor placement activities from one place.</p>
          </div>
          <div className="admin-user">
            <span className="admin-avatar">A</span>
            <div>
              <strong>{user?.name || "Administrator"}</strong>
              <p>Administrator</p>
            </div>
          </div>
        </header>

        <section className="admin-welcome">
          <div>
            <h2>Welcome back, {user?.name || "Admin"}!</h2>
            <p>Here is your placement activity overview.</p>
          </div>
          <button onClick={() => navigate("/admin/applications")}>
            Review Applications →
          </button>
        </section>

        {loading ? (
          <p className="admin-message">Loading application statistics...</p>
        ) : (
          <>
            {error && <p className="admin-error">{error}</p>}

            <section className="admin-stats">
              <article className="admin-stat">
                <span>Total Applications</span>
                <strong>{total}</strong>
                <small>Applications received</small>
              </article>

              <article className="admin-stat">
                <span>Shortlisted</span>
                <strong>{shortlisted}</strong>
                <small>Students shortlisted</small>
              </article>

              <article className="admin-stat">
                <span>Pending Review</span>
                <strong>{pending}</strong>
                <small>Awaiting a decision</small>
              </article>

              <article className="admin-stat">
                <span>Rejected</span>
                <strong>{rejected}</strong>
                <small>Applications rejected</small>
              </article>
            </section>

            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <h2>Recent Applications</h2>
                  <p>Latest applications available in the system.</p>
                </div>
                <button onClick={() => navigate("/admin/applications")}>
                  View All
                </button>
              </div>

              {applications.length === 0 ? (
                <p className="admin-message">No applications found yet.</p>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Company</th>
                        <th>Job Role</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.slice(0, 5).map((app, index) => (
                        <tr key={app._id || app.id || index}>
                          <td>
                            {app.student?.name ||
                              app.studentName ||
                              app.user?.name ||
                              "Student"}
                          </td>
                          <td>
                            {app.placement?.companyName ||
                              app.companyName ||
                              app.drive?.companyName ||
                              "—"}
                          </td>
                          <td>
                            {app.placement?.jobRole ||
                              app.jobRole ||
                              app.drive?.jobRole ||
                              "—"}
                          </td>
                          <td>
                            <span className="admin-status">
                              {app.status || "Pending"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
