import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/apiClient";
import "./AdminPlacements.css";

const INITIAL_FORM_STATE = {
  companyName: "",
  jobRole: "",
  package: "",
  jobLocation: "",
  driveDate: "",
  applicationDeadline: "",
  minimumCGPA: "",
  minimumPercentage: "",
  allowedDepartments: "",
  graduationYear: "",
  maximumBacklogs: "0",
  requiredSkills: "",
  jobDescription: "",
  openings: "1",
  status: "upcoming"
};

function AdminPlacements() {
  const navigate = useNavigate();
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriveId, setEditingDriveId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  const fetchDrives = async () => {
    try {
      const response = await api.get("/api/placements", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDrives(response.data.drives || []);
      setError("");
    } catch (err) {
      console.error("Fetch drives error:", err);
      setError(
        err.response?.data?.message || "Failed to load placement drives."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    if (!token || user?.role !== "admin") {
      navigate("/login", { replace: true });
      return;
    }

    const loadDrives = async () => {
      try {
        const response = await api.get("/api/placements", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!isMounted) return;
        setDrives(response.data.drives || []);
        setError("");
      } catch (err) {
        if (!isMounted) return;
        console.error("Fetch drives error:", err);
        setError(
          err.response?.data?.message || "Failed to load placement drives."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDrives();

    return () => {
      isMounted = false;
    };
  }, [navigate, token, user?.role]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const handleOpenCreateModal = () => {
    setEditingDriveId(null);
    setFormData(INITIAL_FORM_STATE);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (drive) => {
    setEditingDriveId(drive._id);
    setFormData({
      companyName: drive.companyName || "",
      jobRole: drive.jobRole || "",
      package: drive.package !== undefined ? drive.package : "",
      jobLocation: drive.jobLocation || "",
      driveDate: drive.driveDate ? drive.driveDate.slice(0, 10) : "",
      applicationDeadline: drive.applicationDeadline
        ? drive.applicationDeadline.slice(0, 10)
        : "",
      minimumCGPA:
        drive.minimumCGPA !== undefined ? String(drive.minimumCGPA) : "",
      minimumPercentage:
        drive.minimumPercentage !== undefined
          ? String(drive.minimumPercentage)
          : "",
      allowedDepartments: Array.isArray(drive.allowedDepartments)
        ? drive.allowedDepartments.join(", ")
        : "",
      graduationYear:
        drive.graduationYear !== undefined ? String(drive.graduationYear) : "",
      maximumBacklogs:
        drive.maximumBacklogs !== undefined
          ? String(drive.maximumBacklogs)
          : "0",
      requiredSkills: Array.isArray(drive.requiredSkills)
        ? drive.requiredSkills.join(", ")
        : "",
      jobDescription: drive.jobDescription || "",
      openings: drive.openings !== undefined ? String(drive.openings) : "1",
      status: drive.status || "upcoming"
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDriveId(null);
    setFormData(INITIAL_FORM_STATE);
    setFormError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.companyName.trim()) {
      return "Company name is required.";
    }
    if (!formData.jobRole.trim()) {
      return "Job role is required.";
    }
    if (
      formData.package === "" ||
      isNaN(Number(formData.package)) ||
      Number(formData.package) <= 0
    ) {
      return "Package must be a positive number.";
    }
    if (!formData.driveDate) {
      return "Drive date is required.";
    }
    if (!formData.applicationDeadline) {
      return "Application deadline is required.";
    }
    if (new Date(formData.applicationDeadline) > new Date(formData.driveDate)) {
      return "Application deadline cannot be after the drive date.";
    }
    if (
      formData.status === "open" &&
      new Date(formData.applicationDeadline) < new Date()
    ) {
      return "Cannot set status to 'Open' when the application deadline has already passed. Please provide a future deadline or set status to 'Closed'.";
    }
    if (
      formData.minimumCGPA !== "" &&
      (Number(formData.minimumCGPA) < 0 || Number(formData.minimumCGPA) > 10)
    ) {
      return "Minimum CGPA must be between 0 and 10.";
    }
    if (
      formData.minimumPercentage !== "" &&
      (Number(formData.minimumPercentage) < 0 ||
        Number(formData.minimumPercentage) > 100)
    ) {
      return "Minimum percentage must be between 0 and 100.";
    }
    if (
      formData.maximumBacklogs !== "" &&
      Number(formData.maximumBacklogs) < 0
    ) {
      return "Maximum backlogs cannot be negative.";
    }
    if (
      formData.graduationYear !== "" &&
      !Number.isInteger(Number(formData.graduationYear))
    ) {
      return "Graduation year must be a valid integer.";
    }
    if (
      formData.openings !== "" &&
      (!Number.isInteger(Number(formData.openings)) ||
        Number(formData.openings) < 1)
    ) {
      return "Openings must be at least 1.";
    }
    return null;
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setFormError("");

    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setSubmitting(true);

    const payload = {
      companyName: formData.companyName.trim(),
      jobRole: formData.jobRole.trim(),
      package: Number(formData.package),
      jobLocation: formData.jobLocation.trim(),
      driveDate: formData.driveDate,
      applicationDeadline: formData.applicationDeadline,
      minimumCGPA:
        formData.minimumCGPA !== "" ? Number(formData.minimumCGPA) : 0,
      minimumPercentage:
        formData.minimumPercentage !== ""
          ? Number(formData.minimumPercentage)
          : 0,
      maximumBacklogs:
        formData.maximumBacklogs !== "" ? Number(formData.maximumBacklogs) : 0,
      graduationYear:
        formData.graduationYear !== ""
          ? Number(formData.graduationYear)
          : undefined,
      openings: formData.openings !== "" ? Number(formData.openings) : 1,
      status: formData.status,
      jobDescription: formData.jobDescription.trim(),
      allowedDepartments: formData.allowedDepartments
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean),
      requiredSkills: formData.requiredSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    };

    try {
      if (editingDriveId) {
        await api.put(
          `/api/placements/${editingDriveId}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setSuccessMessage("Placement drive updated successfully!");
      } else {
        await api.post("/api/placements", payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccessMessage("Placement drive created successfully!");
      }

      handleCloseModal();
      await fetchDrives();

      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error("Save drive error:", err);
      setFormError(
        err.response?.data?.message ||
          "Failed to save placement drive. Please verify all details."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDrive = async (drive) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the placement drive for "${drive.companyName} - ${drive.jobRole}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      setError("");
      await api.delete(`/api/placements/${drive._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMessage(
        `Placement drive for "${drive.companyName}" was deleted successfully.`
      );
      await fetchDrives();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error("Delete drive error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to delete placement drive. Please try again."
      );
    }
  };

  // Filter drives by search and status
  const filteredDrives = drives.filter((drive) => {
    const matchesSearch =
      drive.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drive.jobRole?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Array.isArray(drive.requiredSkills) &&
        drive.requiredSkills.some((s) =>
          s.toLowerCase().includes(searchTerm.toLowerCase())
        ));

    const matchesStatus =
      statusFilter === "all" ||
      drive.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const isDriveExpired = (drive) => {
    if (!drive?.applicationDeadline) return false;
    return new Date() > new Date(drive.applicationDeadline);
  };

  const isAcceptingApplications = (drive) => {
    return drive.status?.toLowerCase() === "open" && !isDriveExpired(drive);
  };

  const totalDrives = drives.length;
  const activeOpenDrives = drives.filter(isAcceptingApplications).length;
  const expiredOpenDrives = drives.filter(
    (d) => d.status?.toLowerCase() === "open" && isDriveExpired(d)
  ).length;
  const upcomingDrives = drives.filter(
    (d) => d.status?.toLowerCase() === "upcoming"
  ).length;
  const closedDrives = drives.filter(
    (d) => d.status?.toLowerCase() === "closed"
  ).length;

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2 className="admin-brand">LP LaunchPath</h2>
        <p className="admin-subtitle">Admin Portal</p>

        <button onClick={() => navigate("/admin/dashboard")}>Dashboard</button>
        <button onClick={() => navigate("/admin/applications")}>
          Applications
        </button>
        <button
          className="nav-active"
          onClick={() => navigate("/admin/placements")}
        >
          Placement Drives
        </button>
        <button onClick={() => navigate("/analytics")}>Analytics</button>

        <button className="admin-logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <div>
            <p className="admin-eyebrow">PLACEMENT MANAGEMENT</p>
            <h1>Placement Drives</h1>
            <p>Create, view, edit, and manage campus recruitment drives.</p>
          </div>
          <div className="admin-user">
            <span className="admin-avatar">A</span>
            <div>
              <strong>{user?.name || "Administrator"}</strong>
              <p>Administrator</p>
            </div>
          </div>
        </header>

        {/* Success or Error Banners */}
        {successMessage && (
          <div className="admin-success-banner">
            <span>✓ {successMessage}</span>
            <button
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
                color: "#027a48"
              }}
              onClick={() => setSuccessMessage("")}
            >
              ✕
            </button>
          </div>
        )}

        {error && (
          <div className="admin-error-banner">
            <span>⚠ {error}</span>
            <button
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
                color: "#dc2626"
              }}
              onClick={() => setError("")}
            >
              ✕
            </button>
          </div>
        )}

        {/* Stats Row */}
        <section className="admin-stats" style={{ marginTop: "24px" }}>
          <article className="admin-stat">
            <span>Total Drives</span>
            <strong>{totalDrives}</strong>
            <small>Active & past campus drives</small>
          </article>
          <article className="admin-stat">
            <span>Open & Active</span>
            <strong style={{ color: "#027a48" }}>{activeOpenDrives}</strong>
            <small>
              {expiredOpenDrives > 0
                ? `${expiredOpenDrives} open drive(s) passed deadline`
                : "Accepting applications"}
            </small>
          </article>
          <article className="admin-stat">
            <span>Upcoming Drives</span>
            <strong style={{ color: "#175cd3" }}>{upcomingDrives}</strong>
            <small>Scheduled drives</small>
          </article>
          <article className="admin-stat">
            <span>Closed Drives</span>
            <strong style={{ color: "#667085" }}>{closedDrives}</strong>
            <small>Completed or inactive</small>
          </article>
        </section>

        {/* Toolbar & Filter Bar */}
        <div className="admin-toolbar">
          <div className="admin-toolbar-actions">
            <input
              type="text"
              className="admin-search-input"
              placeholder="Search by company, role, skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="admin-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="upcoming">Upcoming</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <button
            className="admin-primary-btn"
            onClick={handleOpenCreateModal}
          >
            + Create Placement Drive
          </button>
        </div>

        {/* Panel with Drives Table */}
        <section className="admin-panel" style={{ marginTop: "10px" }}>
          <div className="admin-panel-heading">
            <div>
              <h2>All Placement Drives</h2>
              <p>
                Showing {filteredDrives.length} of {totalDrives} drives
              </p>
            </div>
          </div>

          {loading ? (
            <p className="admin-message">Loading placement drives...</p>
          ) : filteredDrives.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <p style={{ color: "#64748b", marginBottom: "16px" }}>
                {drives.length === 0
                  ? "No placement drives have been created yet."
                  : "No drives match your search or filter criteria."}
              </p>
              {drives.length === 0 && (
                <button
                  className="admin-primary-btn"
                  onClick={handleOpenCreateModal}
                >
                  Create First Drive
                </button>
              )}
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Company & Role</th>
                    <th>Package</th>
                    <th>Eligibility Criteria</th>
                    <th>Required Skills</th>
                    <th>Timeline</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDrives.map((drive) => {
                    const statusClass = `badge-status status-${(
                      drive.status || "upcoming"
                    ).toLowerCase()}`;
                    return (
                      <tr key={drive._id}>
                        <td>
                          <strong style={{ color: "#172b55", display: "block" }}>
                            {drive.companyName}
                          </strong>
                          <span style={{ color: "#475467", fontSize: "12px" }}>
                            {drive.jobRole}
                          </span>
                          {drive.jobLocation && (
                            <span
                              style={{
                                display: "block",
                                color: "#94a3b8",
                                fontSize: "11px"
                              }}
                            >
                              📍 {drive.jobLocation}
                            </span>
                          )}
                        </td>
                        <td>
                          <strong style={{ color: "#0f766e" }}>
                            ₹{drive.package} LPA
                          </strong>
                          {drive.openings && (
                            <small
                              style={{
                                display: "block",
                                color: "#64748b",
                                fontSize: "11px"
                              }}
                            >
                              {drive.openings} opening{drive.openings > 1 ? "s" : ""}
                            </small>
                          )}
                        </td>
                        <td style={{ fontSize: "12px", color: "#334155" }}>
                          <div>
                            <strong>Min CGPA:</strong> {drive.minimumCGPA ?? 0}
                          </div>
                          <div>
                            <strong>Max Backlogs:</strong>{" "}
                            {drive.maximumBacklogs ?? 0}
                          </div>
                          {drive.graduationYear && (
                            <div>
                              <strong>Batch:</strong> {drive.graduationYear}
                            </div>
                          )}
                          {Array.isArray(drive.allowedDepartments) &&
                            drive.allowedDepartments.length > 0 && (
                              <div
                                style={{
                                  color: "#64748b",
                                  marginTop: "2px",
                                  fontSize: "11px"
                                }}
                              >
                                {drive.allowedDepartments.join(", ")}
                              </div>
                            )}
                        </td>
                        <td>
                          {Array.isArray(drive.requiredSkills) &&
                          drive.requiredSkills.length > 0 ? (
                            <div className="skill-chips">
                              {drive.requiredSkills.map((skill, idx) => (
                                <span key={idx} className="skill-chip">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span style={{ color: "#94a3b8", fontSize: "12px" }}>
                              None listed
                            </span>
                          )}
                        </td>
                        <td style={{ fontSize: "12px" }}>
                          <div>
                            <span style={{ color: "#64748b" }}>Drive: </span>
                            <strong>
                              {drive.driveDate
                                ? new Date(drive.driveDate).toLocaleDateString()
                                : "—"}
                            </strong>
                          </div>
                          <div style={{ marginTop: "3px" }}>
                            <span style={{ color: "#64748b" }}>Deadline: </span>
                            <span
                              style={{
                                fontWeight: "600",
                                color: isDriveExpired(drive) ? "#dc2626" : "#166534"
                              }}
                            >
                              {drive.applicationDeadline
                                ? new Date(
                                    drive.applicationDeadline
                                  ).toLocaleDateString()
                                : "—"}
                            </span>
                            {isDriveExpired(drive) && (
                              <span
                                style={{
                                  display: "inline-block",
                                  marginLeft: "5px",
                                  padding: "1px 5px",
                                  fontSize: "10px",
                                  fontWeight: "700",
                                  background: "#fee2e2",
                                  color: "#991b1b",
                                  borderRadius: "4px"
                                }}
                              >
                                Passed
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={statusClass}>
                            {drive.status || "upcoming"}
                          </span>
                          {drive.status?.toLowerCase() === "open" && isDriveExpired(drive) && (
                            <span
                              style={{
                                display: "block",
                                marginTop: "4px",
                                fontSize: "11px",
                                fontWeight: "600",
                                color: "#b91c1c"
                              }}
                              title="Applications are closed because deadline has passed"
                            >
                              Deadline Expired
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <div
                            className="action-btn-group"
                            style={{ justifyContent: "flex-end" }}
                          >
                            <button
                              className="btn-edit"
                              onClick={() => handleOpenEditModal(drive)}
                              title="Edit placement drive"
                            >
                              Edit
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => handleDeleteDrive(drive)}
                              title="Delete placement drive"
                            >
                              Delete
                            </button>
                          </div>
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

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-header">
              <h2>
                {editingDriveId
                  ? "Edit Placement Drive"
                  : "Create Placement Drive"}
              </h2>
              <button
                className="modal-close-btn"
                onClick={handleCloseModal}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitForm}>
              <div className="modal-body">
                {formError && (
                  <div
                    className="admin-error-banner"
                    style={{ marginBottom: "16px" }}
                  >
                    <span>⚠ {formError}</span>
                  </div>
                )}

                <div className="form-grid">
                  <div className="form-group">
                    <label>
                      Company Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      placeholder="e.g. Google, Microsoft, TCS"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Job Role <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="jobRole"
                      placeholder="e.g. Software Development Engineer"
                      value={formData.jobRole}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Package (LPA) <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.1"
                      name="package"
                      placeholder="e.g. 12"
                      value={formData.package}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Job Location</label>
                    <input
                      type="text"
                      name="jobLocation"
                      placeholder="e.g. Bangalore / Hybrid"
                      value={formData.jobLocation}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Drive Date <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      name="driveDate"
                      value={formData.driveDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Application Deadline <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      name="applicationDeadline"
                      value={formData.applicationDeadline}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Drive Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="open">Open</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Number of Openings</label>
                    <input
                      type="number"
                      min="1"
                      name="openings"
                      placeholder="e.g. 5"
                      value={formData.openings}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Minimum CGPA (0 - 10)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      name="minimumCGPA"
                      placeholder="e.g. 7.5 (0 for none)"
                      value={formData.minimumCGPA}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Minimum Percentage (0 - 100)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      name="minimumPercentage"
                      placeholder="e.g. 60 (0 for none)"
                      value={formData.minimumPercentage}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Maximum Allowed Backlogs</label>
                    <input
                      type="number"
                      min="0"
                      name="maximumBacklogs"
                      placeholder="e.g. 0"
                      value={formData.maximumBacklogs}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Graduation Year</label>
                    <input
                      type="number"
                      name="graduationYear"
                      placeholder="e.g. 2026"
                      value={formData.graduationYear}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group form-full-width">
                    <label>Eligible Departments</label>
                    <input
                      type="text"
                      name="allowedDepartments"
                      placeholder="e.g. CSE, IT, ECE, EEE (comma-separated)"
                      value={formData.allowedDepartments}
                      onChange={handleInputChange}
                    />
                    <small>Leave empty to allow all departments.</small>
                  </div>

                  <div className="form-group form-full-width">
                    <label>Required Skills</label>
                    <input
                      type="text"
                      name="requiredSkills"
                      placeholder="e.g. React, Node.js, Python, SQL (comma-separated)"
                      value={formData.requiredSkills}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group form-full-width">
                    <label>Job Description</label>
                    <textarea
                      name="jobDescription"
                      rows="3"
                      placeholder="Role responsibilities, interview rounds, instructions..."
                      value={formData.jobDescription}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="admin-secondary-btn"
                  onClick={handleCloseModal}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-primary-btn"
                  disabled={submitting}
                >
                  {submitting
                    ? "Saving..."
                    : editingDriveId
                    ? "Update Drive"
                    : "Create Drive"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPlacements;
