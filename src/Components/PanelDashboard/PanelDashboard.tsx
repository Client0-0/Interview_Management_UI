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
        // ─── Mock fallback (no backend) ───
        setCandidates([
          { driveId: 701, driveName: "Campus Drive - JNTU", driveDate: "2025-12-06", candidateId: 801, fullName: "Sneha Reddy", email: "sneha.r@gmail.com", phone: "8765432100", address: "Hyderabad", college: "JNTU", previousCompany: "Infosys", status: 1, roundType: "1", roundStatus: "Scheduled", roundResult: "", interviewerName: "You", interviewerEmail: "panel@mock.com", interviewerPhone: "9988776601", interviewerId: 9004, candidateExperienceLevel: "2", techStack: ["React", "Node.js"], resumeUrl: "", linkedInUrl: "", gitHubUrl: "", userName: "", useremail: "", attendanceStatus: "Present" },
          { driveId: 701, driveName: "Campus Drive - JNTU", driveDate: "2025-12-06", candidateId: 802, fullName: "Karthik Iyer", email: "karthik.i@gmail.com", phone: "8765432101", address: "Chennai", college: "Anna University", previousCompany: "TCS", status: 1, roundType: "1", roundStatus: "Scheduled", roundResult: "", interviewerName: "You", interviewerEmail: "panel@mock.com", interviewerPhone: "9988776602", interviewerId: 9004, candidateExperienceLevel: "3", techStack: ["Java", "Spring Boot"], resumeUrl: "", linkedInUrl: "", gitHubUrl: "", userName: "", useremail: "", attendanceStatus: "Present" },
          { driveId: 702, driveName: "Lateral Hiring - React", driveDate: "2025-12-06", candidateId: 804, fullName: "Rohan Das", email: "rohan.d@gmail.com", phone: "8765432103", address: "Bangalore", college: "RV College", previousCompany: "Wipro", status: 1, roundType: "1", roundStatus: "Scheduled", roundResult: "", interviewerName: "You", interviewerEmail: "panel@mock.com", interviewerPhone: "9988776604", interviewerId: 9004, candidateExperienceLevel: "4", techStack: ["Angular", ".NET"], resumeUrl: "", linkedInUrl: "", gitHubUrl: "", userName: "", useremail: "", attendanceStatus: "Present" },
        ]);
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
                <span className="icon">🧑‍💼</span> {c.candidateExperienceLevel} years experience
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



