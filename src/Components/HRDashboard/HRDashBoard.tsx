import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, UserCheck, Upload, Calendar } from 'lucide-react';
import DashboardCard from "../common/DashboardCard";
import PanelAvailability from "./PanelAvailability";
import "./Styles/HRDashboard.css";

const HRDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="hr-dashboard-wrapper">
      <div className="hr-content-container">

        {/* Date Section */}
        <div className="hr-date-pill">
          <Calendar size={18} className="hr-date-icon" />
          <span>{currentDate}</span>
        </div>

        {/* Grid Cards */}
        <div className="hr-cards-grid">
          <DashboardCard
            theme="blue"
            title="Panel Available Today"
            icon={<Users size={24} />}
            value="8"
            subtext="Interviewers ready"
            actionText="View Panel Availability"
            onClick={() => setIsPanelOpen(true)}
          />

          <DashboardCard
            theme="green"
            title="Candidates Present Today"
            icon={<UserCheck size={24} />}
            value="12"
            subtext="Scheduled for interviews"
            actionText="View Details"
            onClick={() => navigate("candidates")}
          />

          <DashboardCard
            theme="purple"
            title="Manage Candidates"
            icon={<Upload size={24} />}
            value={<span className="hr-text-value">Upload & track candidates</span>}
            actionText="Go to Management"
            onClick={() => navigate("candidatemanagement")}
          />
        </div>

      </div>
      <PanelAvailability isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
    </div>
  );
};

export default HRDashboard;
