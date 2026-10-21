import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/apiClient";
import "./AdminApplications.css";

const STATUS_OPTIONS = ["Pending", "Shortlisted", "Selected", "Rejected"];

function AdminApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successBanner, setSuccessBanner] = useState("");

  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Selected statuses per application for manual update
  const [pendingStatuses, setPendingStatuses] = useState({});
  const [updatingId, setUpdatingId] = useState(null);
  const [rowFeedback, setRowFeedback] = useState({});

  const token = localStorage.getItem("token");
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  useEffect(() => {
    let isMounted = true;

    if (!token || user?.role !== "admin") {
      navigate("/login", { replace: true });
      return;
    }

    const loadApplications = async () => {
      try {
        const response = await api.get("/api/applications", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!isMounted) return;
        const data = response.data;
        const list = Array.isArray(data)
          ? data
          : data.applications || data.data || [];
        setApplications(list);

        // Initialize pending status values
        const initialStatuses = {};
        list.forEach((app) => {
          initialStatuses[app._id] = app.status || "Pending";
        });
        setPendingStatuses(initialStatuses);
        setError("");
      } catch (err) {
        if (!isMounted) return;
        console.error("Fetch applications error:", err);
        setError(
          err.response?.data?.message ||
            "Unable to load applications. Admin access is required."
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
  }, [navigate, token, user?.role]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const handleSelectStatus = (appId, newStatus) => {
    setPendingStatuses((prev) => ({
      ...prev,
      [appId]: newStatus
    }));
  };

  const handleUpdateStatus = async (appId) => {
    const targetStatus = pendingStatuses[appId];
    if (!targetStatus) return;

    setUpdatingId(appId);
    setRowFeedback((prev) => ({ ...prev, [appId]: null }));

    try {
      await api.patch(
        `/api/applications/${appId}/status`,
        { status: targetStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update in local state
      setApplications((prev) =>
        prev.map((app) =>
          app._id === appId ? { ...app, status: targetStatus } : app
        )
      );

      setRowFeedback((prev) => ({
        ...prev,
        [appId]: { type: "success", message: "Updated!" }
      }));
      setSuccessBanner(`Application status updated to "${targetStatus}"`);

      setTimeout(() => {
        setRowFeedback((prev) => ({ ...prev, [appId]: null }));
      }, 3000);
      setTimeout(() => setSuccessBanner(""), 4000);
    } catch (err) {
      console.error("Update status error:", err);
      const errMsg =
        err.response?.data?.message || "Failed to update application status.";
      setRowFeedback((prev) => ({
        ...prev,
        [appId]: { type: "error", message: errMsg }
      }));
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtered applications
  const filteredApplications = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return applications.filter((app) => {
      const studentName = app.student?.name?.toLowerCase() || "";
      const studentEmail = app.student?.email?.toLowerCase() || "";
      const registerNumber = app.student?.registerNumber?.toLowerCase() || "";
      const department = app.student?.department?.toLowerCase() || "";
      const company = app.placementDrive?.companyName?.toLowerCase() || "";
      const role = app.placementDrive?.jobRole?.toLowerCase() || "";

      const matchesSearch =
        !q ||
        studentName.includes(q) ||
        studentEmail.includes(q) ||
        registerNumber.includes(q) ||
        department.includes(q) ||
        company.includes(q) ||
        role.includes(q);

      const matchesStatus =
        statusFilter === "all" ||
        app.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, statusFilter]);

  // Statistics
  const total = applications.length;
  const shortlisted = applications.filter(
    (app) => app.status?.toLowerCase() === "shortlisted"
  ).length;
  const selected = applications.filter(
    (app) => app.status?.toLowerCase() === "selected"
  ).length;
  const pending = applications.filter(
    (app) => app.status?.toLowerCase() === "pending"
  ).length;
  const rejected = applications.filter(
    (app) => app.status?.toLowerCase() === "rejected"
  ).length;

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const getStatusBadgeClass = (status) => {
    const s = status?.toLowerCase();
    if (s === "selected") return "app-status-badge selected";
    if (s === "shortlisted") return "app-status-badge shortlisted";
    if (s === "rejected") return "app-status-badge rejected";
    return "app-status-badge pending";
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2 className="admin-brand">LP LaunchPath</h2>
        <p className="admin-subtitle">Admin Portal</p>

        <button onClick={() => navigate("/admin/dashboard")}>Dashboard</button>
        <button
          className="nav-active"
          onClick={() => navigate("/admin/applications")}
        >
          Applications
        </button>
        <button onClick={() => navigate("/admin/placements")}>
          Placement Drives
        </button>
        <button onClick={() => navigate("/analytics")}>Analytics</button>

        <button className="admin-logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* Main Area */}
      <main className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <div>
            <p className="admin-eyebrow">APPLICATION MANAGEMENT</p>
            <h1>Student Applications</h1>
            <p>
              Review applicants, filter by company or status, and update application decisions.
            </p>
          </div>
          <div className="admin-user">
            <span className="admin-avatar">A</span>
            <div>
              <strong>{user?.name || "Administrator"}</strong>
              <p>Administrator</p>
            </div>
          </div>
        </header>

        {/* Success / Error Banners */}
        {successBanner && (
          <div
            style={{
              padding: "12px 16px",
              margin: "20px 0 10px",
              borderRadius: "8px",
              background: "#ecfdf3",
              border: "1px solid #a6f4c5",
              color: "#027a48",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <span>✓ {successBanner}</span>
            <button
              onClick={() => setSuccessBanner("")}
              style={{
                background: "transparent",
                border: "none",
                color: "#027a48",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              ✕
            </button>
          </div>
        )}

        {error && (
          <div
            style={{
              padding: "12px 16px",
              margin: "20px 0 10px",
              borderRadius: "8px",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#dc2626",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <span>⚠ {error}</span>
            <button
              onClick={() => setError("")}
              style={{
                background: "transparent",
                border: "none",
                color: "#dc2626",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Stats Row */}
        <section className="admin-stats" style={{ marginTop: "24px" }}>
          <article className="admin-stat">
            <span>Total Applications</span>
            <strong>{total}</strong>
            <small>All applicant submissions</small>
          </article>
          <article className="admin-stat">
            <span>Pending Review</span>
            <strong style={{ color: "#b45309" }}>{pending}</strong>
            <small>Awaiting decision</small>
          </article>
          <article className="admin-stat">
            <span>Shortlisted</span>
            <strong style={{ color: "#4338ca" }}>{shortlisted}</strong>
            <small>Interview / next stage</small>
          </article>
          <article className="admin-stat">
            <span>Selected</span>
            <strong style={{ color: "#15803d" }}>{selected}</strong>
            <small>Offers extended</small>
          </article>
          <article className="admin-stat">
            <span>Rejected</span>
            <strong style={{ color: "#b91c1c" }}>{rejected}</strong>
            <small>Did not qualify</small>
          </article>
        </section>

        {/* Toolbar: Search and Filter */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "14px",
            margin: "24px 0 18px",
            flexWrap: "wrap"
          }}
        >
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", flex: 1 }}>
            <input
              type="text"
              placeholder="Search by student, email, reg no, company, role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-search-input"
              style={{
                flex: "1",
                minWidth: "260px",
                padding: "10px 14px",
                border: "1px solid #d0d7e2",
                borderRadius: "8px",
                fontSize: "14px"
              }}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="admin-filter-select"
              style={{
                padding: "10px 14px",
                border: "1px solid #d0d7e2",
                borderRadius: "8px",
                fontSize: "14px",
                background: "#fff"
              }}
            >
              <option value="all">All Statuses ({total})</option>
              <option value="Pending">Pending ({pending})</option>
              <option value="Shortlisted">Shortlisted ({shortlisted})</option>
              <option value="Selected">Selected ({selected})</option>
              <option value="Rejected">Rejected ({rejected})</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => navigate("/admin/dashboard")}
              style={{
                padding: "9px 14px",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                background: "#fff",
                color: "#1e3a8a",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "13px"
              }}
            >
              ← Dashboard
            </button>
            <button
              onClick={() => navigate("/admin/placements")}
              style={{
                padding: "9px 14px",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                background: "#fff",
                color: "#1e3a8a",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "13px"
              }}
            >
              Placement Drives →
            </button>
          </div>
        </div>

        {/* Applications Panel */}
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <h2>Applications List</h2>
              <p>
                Showing {filteredApplications.length} of {applications.length} applications
              </p>
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                style={{
                  padding: "6px 12px",
                  fontSize: "12px",
                  background: "#f1f5f9",
                  color: "#475569",
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Clear Search
              </button>
            )}
          </div>

          {loading ? (
            <p className="admin-message">Loading applications...</p>
          ) : applications.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <h3>No Applications Found</h3>
              <p style={{ color: "#64748b", marginTop: "8px" }}>
                Students have not submitted any placement applications yet.
              </p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <h3>No Matching Applications</h3>
              <p style={{ color: "#64748b", marginTop: "8px" }}>
                No applications matched your search or status filter.
              </p>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Student Details</th>
                    <th>Company & Role</th>
                    <th>Package</th>
                    <th>Applied Date</th>
                    <th>Current Status</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => {
                    const student = app.student || {};
                    const drive = app.placementDrive || {};
                    const isRowUpdating = updatingId === app._id;
                    const feedback = rowFeedback[app._id];
                    const selectedStatus =
                      pendingStatuses[app._id] || app.status || "Pending";
                    const isChanged = selectedStatus !== app.status;

                    return (
                      <tr key={app._id}>
                        {/* Student Details */}
                        <td>
                          <div className="app-student-info">
                            <strong>{student.name || "Unknown Student"}</strong>
                            <span>{student.email || "No email"}</span>
                            <span>
                              Reg No: {student.registerNumber || "—"}{" "}
                              {student.department ? `• ${student.department}` : ""}
                            </span>
                          </div>
                        </td>

                        {/* Company & Role */}
                        <td>
                          <div className="app-company-info">
                            <strong>{drive.companyName || "Unknown Company"}</strong>
                            <span>{drive.jobRole || "—"}</span>
                          </div>
                        </td>

                        {/* Package */}
                        <td>
                          <strong>
                            {drive.package !== undefined ? `₹${drive.package} LPA` : "—"}
                          </strong>
                        </td>

                        {/* Applied Date */}
                        <td>
                          <span className="app-date-info">
                            {formatDate(app.appliedAt || app.createdAt)}
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td>
                          <span className={getStatusBadgeClass(app.status)}>
                            {app.status || "Pending"}
                          </span>
                        </td>

                        {/* Update Status Actions */}
                        <td>
                          <div className="app-update-group">
                            <select
                              value={selectedStatus}
                              disabled={isRowUpdating}
                              onChange={(e) =>
                                handleSelectStatus(app._id, e.target.value)
                              }
                              className="app-status-select"
                            >
                              {STATUS_OPTIONS.map((st) => (
                                <option key={st} value={st}>
                                  {st}
                                </option>
                              ))}
                            </select>

                            <button
                              onClick={() => handleUpdateStatus(app._id)}
                              disabled={isRowUpdating || !isChanged}
                              className="app-update-btn"
                              title={
                                isChanged
                                  ? `Save change to ${selectedStatus}`
                                  : "Select a different status to update"
                              }
                            >
                              {isRowUpdating ? "Saving..." : "Update"}
                            </button>
                          </div>

                          {feedback && (
                            <span
                              className={`app-row-feedback ${feedback.type}`}
                            >
                              {feedback.type === "success" ? "✓" : "⚠"}{" "}
                              {feedback.message}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminApplications;
