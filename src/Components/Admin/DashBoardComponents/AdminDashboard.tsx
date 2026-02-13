import React, { useState } from "react";
import "./Styles/hirehub.css";

/* ================= PAGES ================= */
import Dashboard from "./Dashboard";
import Users from "./Users";
import Candidates from "./Candidates";
import Panels from "./Panels";
import Mentor from "./Mentor";
import HR from "./Hr";
import Drives from "./Drive";
import BulkUploadCandidates from "./BulkUploadCandidates";
import Assignments from "./Assignments";
import Header from "../../Header/Header";

/* ================= WIZARD ================= */
import CreateDriveWizard from "./CreateDriveWizard";

/* ================= TAB TYPE ================= */
export type TabType =
  | "dashboard"
  | "users"
  | "candidates"
  | "panels"
  | "mentors"
  | "hr"
  | "drives"
  | "bulkupload"
  | "assignments";

const AdminDashboard: React.FC = () => {
  const [tab, setTab] = useState<TabType>("dashboard");
  const [showCreateDrive, setShowCreateDrive] = useState(false);

  return (
    <div className="app-root">
      <Header />

      {/* TOP NAV */}
      <nav className="tabs">
        <button className={`tab ${tab === "dashboard" ? "active" : ""}`} onClick={() => setTab("dashboard")}>Dashboard</button>
        <button className={`tab ${tab === "users" ? "active" : ""}`} onClick={() => setTab("users")}>Users</button>
        <button className={`tab ${tab === "candidates" ? "active" : ""}`} onClick={() => setTab("candidates")}>Candidates</button>
        <button className={`tab ${tab === "panels" ? "active" : ""}`} onClick={() => setTab("panels")}>Panels</button>
        <button className={`tab ${tab === "mentors" ? "active" : ""}`} onClick={() => setTab("mentors")}>Mentors</button>
        <button className={`tab ${tab === "hr" ? "active" : ""}`} onClick={() => setTab("hr")}>HR</button>
        <button className={`tab ${tab === "drives" ? "active" : ""}`} onClick={() => setTab("drives")}>Drives</button>
      </nav>

      {/* MAIN CONTENT */}
      <main className="page">
        {tab === "dashboard" && <Dashboard />}
        {tab === "users" && <Users />}
        {tab === "candidates" && <Candidates />}
        {tab === "panels" && <Panels />}
        {tab === "mentors" && <Mentor />}
        {tab === "hr" && <HR />}

        {tab === "drives" && (
          <Drives />
        )}

        {tab === "bulkupload" && (
          <BulkUploadCandidates onBack={() => setTab("candidates")} />
        )}

        {tab === "assignments" && <Assignments />}
      </main>

      {/* CREATE DRIVE WIZARD (MODAL) */}
      {showCreateDrive && (
        <CreateDriveWizard
          onClose={() => setShowCreateDrive(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
