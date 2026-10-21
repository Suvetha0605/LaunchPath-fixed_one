import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Split screens into separate chunks so the initial page loads faster.
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Placements = lazy(() => import("./pages/Placements"));
const SkillGap = lazy(() => import("./pages/SkillGap"));
const Preparation = lazy(() => import("./pages/Preparation"));
const Companies = lazy(() => import("./pages/Companies"));
const Analytics = lazy(() => import("./pages/Analytics"));
const MyApplications = lazy(() => import("./pages/MyApplications"));
const AdminApplications = lazy(() => import("./pages/AdminApplications"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminPlacements = lazy(() => import("./pages/AdminPlacements"));

function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<div role="status">Loading page...</div>}>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/placements" element={<ProtectedRoute><Placements /></ProtectedRoute>} />
                    <Route path="/skill-gap" element={<ProtectedRoute><SkillGap /></ProtectedRoute>} />
                    <Route path="/preparation" element={<ProtectedRoute><Preparation /></ProtectedRoute>} />
                    <Route path="/companies" element={<ProtectedRoute><Companies /></ProtectedRoute>} />
                    <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                    <Route path="/my-applications" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />
                    <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/admin/applications" element={<ProtectedRoute requiredRole="admin"><AdminApplications /></ProtectedRoute>} />
                    <Route path="/admin/placements" element={<ProtectedRoute requiredRole="admin"><AdminPlacements /></ProtectedRoute>} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default App;
