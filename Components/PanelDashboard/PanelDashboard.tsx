import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPanelAssignedCandidates } from "../../Services/User.Service";
import "../Styles/PanelDashboard.css";
import type { MentorCandidate } from "../../Models/user";

const PanelDashboard: React.FC = () => {
  const [candidates, setCandidates] = useState<MentorCandidate[]>([]);
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const data = await getPanelAssignedCandidates();
        setCandidates(data);
      } catch (err) {
        console.error("Failed to load candidates", err);
      }
    };

    fetchCandidates();
  }, []);

  return (
    <div className="panel-dashboard">
      <div className="dashboard-date">
        <span className="date-icon">📅</span>
        {today}
      </div>

      {/* Summary Card */}
      <div className="summary-box">
        <div className="summary-content">
          <span className="summary-icon">👤</span>
          <div>
            <h3>Candidates Available Today</h3>
            <p>{candidates?.length ?? 0} interviews scheduled</p>
          </div>
        </div>
        <button
          className="set-availability-btn"
          onClick={() => navigate("/setavailabilty")}
        >
          ⏰ Set Availability
        </button>
      </div>

      {/* Candidates Grid */}
      <h4 className="section-title">Today's Interviews</h4>
      <div className="candidate-grid">
        {candidates.map((c) => (
          <div key={c.candidateId} className="candidate-card">
            <div className="row-between">
              <h3 className="candidate-name">{c.fullName}</h3>
              <span className="badge">Scheduled</span>
            </div>

            <div className="candidate-info">
              <p>
                <span className="icon">💼</span> {c.college}
              </p>
              <p>
                <span className="icon">🧑‍💼</span> {c.experienceLevelName} years experience
              </p>
              <p>
                <span className="icon">⏰</span> {c.phone}
              </p>
            </div>

            <div className="card-footer">
              <button
                className="view-details"
                onClick={() => navigate(`/details/${c.candidateId}`)}
              >
                View Details →
              </button>
              <button
                className="reassign-btn"
                onClick={() => navigate(`/reassign/${c.candidateId}`)}
              >
                ⟳ Reassign Panel
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PanelDashboard;



