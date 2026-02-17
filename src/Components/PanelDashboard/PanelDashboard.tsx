import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPanelAssignedCandidates } from "../../Services/User.Service";
import "../Styles/PanelDashboard.css";
import type { MentorCandidate } from "../../Models/user";
import {
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaCommentDots,
  FaCalendarCheck,
} from "react-icons/fa";

const PanelDashboard: React.FC = () => {
  const [candidates, setCandidates] = useState<MentorCandidate[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const data = await getPanelAssignedCandidates();
        setCandidates(data);
      } catch (err) {
        console.error("Failed to load candidates", err);
        // ─── Mock fallback (no backend) ───
        setCandidates([
          { driveId: 701, driveName: "Campus Drive - JNTU", driveDate: "2025-12-06", candidateId: 801, fullName: "Sneha Reddy", email: "sneha.r@gmail.com", phone: "8765432100", address: "Hyderabad", college: "JNTU", previousCompany: "Infosys", status: 1, roundType: "1", roundStatus: "Scheduled", roundResult: "", interviewerName: "You", interviewerEmail: "panel@mock.com", interviewerPhone: "9988776601", interviewerId: 9004, candidateExperienceLevel: "2", techStack: ["React", "Node.js"], resumeUrl: "", linkedInUrl: "", gitHubUrl: "", userName: "", useremail: "", attendanceStatus: "Present" },
          { driveId: 701, driveName: "Campus Drive - JNTU", driveDate: "2025-12-06", candidateId: 802, fullName: "Karthik Iyer", email: "karthik.i@gmail.com", phone: "8765432101", address: "Chennai", college: "Anna University", previousCompany: "TCS", status: 1, roundType: "1", roundStatus: "Scheduled", roundResult: "", interviewerName: "You", interviewerEmail: "panel@mock.com", interviewerPhone: "9988776602", interviewerId: 9004, candidateExperienceLevel: "3", techStack: ["Java", "Spring Boot"], resumeUrl: "", linkedInUrl: "", gitHubUrl: "", userName: "", useremail: "", attendanceStatus: "Present" },
          { driveId: 702, driveName: "Lateral Hiring - React", driveDate: "2025-12-06", candidateId: 804, fullName: "Rohan Das", email: "rohan.d@gmail.com", phone: "8765432103", address: "Bangalore", college: "RV College", previousCompany: "Wipro", status: 1, roundType: "1", roundStatus: "Scheduled", roundResult: "", interviewerName: "You", interviewerEmail: "panel@mock.com", interviewerPhone: "9988776604", interviewerId: 9004, candidateExperienceLevel: "4", techStack: ["Angular", ".NET"], resumeUrl: "", linkedInUrl: "", gitHubUrl: "", userName: "", useremail: "", attendanceStatus: null },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const getRoundType = (roundType?: number | string | null) => {
    const parsed =
      typeof roundType === "string" ? parseInt(roundType, 10) : roundType;
    if (parsed === 1) return "Tech 1";
    if (parsed === 2) return "Tech 2";
    return "NA";
  };

  const filteredCandidates = candidates.filter(
    c =>
      c.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      c.email.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) return <div className="panel-loading-text">Loading...</div>;

  return (
    <div className="panel-dashboard-container">
      <div className="panel-content-wrapper">

        {/* Header Section */}
        <header className="panel-header">
          <div>
            <h1>Welcome back, Panel</h1>
            <p className="panel-subtitle">
              Here's your schedule for today, {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="panel-stats-grid">
          <div className="panel-card panel-stat-card">
            <div className="panel-stat-icon-wrapper info">
              <FaClipboardList />
            </div>
            <div className="panel-stat-content">
              <span className="panel-stat-label">Scheduled Today</span>
              <strong className="panel-stat-value">{candidates.length}</strong>
            </div>
          </div>

          <div className="panel-card panel-stat-card">
            <div className="panel-stat-icon-wrapper success">
              <FaCheckCircle />
            </div>
            <div className="panel-stat-content">
              <span className="panel-stat-label">Present</span>
              <strong className="panel-stat-value">
                {candidates.filter(c => c.attendanceStatus?.toLowerCase() === "present").length}
              </strong>
            </div>
          </div>

          <div className="panel-card panel-stat-card">
            <div className="panel-stat-icon-wrapper warning">
              <FaClock />
            </div>
            <div className="panel-stat-content">
              <span className="panel-stat-label">Pending</span>
              <strong className="panel-stat-value">
                {candidates.filter(c => !c.attendanceStatus || c.attendanceStatus.toLowerCase() === "pending").length}
              </strong>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="panel-quick-actions-section">
          <h3 className="panel-section-title">Quick Actions</h3>
          <div className="panel-actions-grid">
            <button className="panel-card panel-action-card" onClick={() => navigate("/panel/interviewfeedback")}>
              <div className="panel-action-icon-wrapper">
                <FaCommentDots />
              </div>
              <div className="panel-action-details">
                <strong>Submit Feedback</strong>
                <p>Provide interview feedback</p>
              </div>
              <i className="fa-solid fa-chevron-right panel-arrow-icon"></i>
            </button>

            <button className="panel-card panel-action-card" onClick={() => navigate("/panel/setavailability")}>
              <div className="panel-action-icon-wrapper">
                <FaCalendarCheck />
              </div>
              <div className="panel-action-details">
                <strong>Set Availability</strong>
                <p>Update your schedule</p>
              </div>
              <i className="fa-solid fa-chevron-right panel-arrow-icon"></i>
            </button>
          </div>
        </section>

        {/* Filter & Search */}
        <section className="panel-filter-section">
          <div className="panel-search-filter-container">
            <div className="panel-search-box">
              <i className="fa-solid fa-search"></i>
              <input
                type="text"
                placeholder="Search candidates by name, email..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Candidates Grid */}
        <section className="panel-candidates-section">
          <h3 className="panel-section-title">Today's Interviews</h3>

          <div className="panel-candidates-scroll-container">
            <div className="panel-candidates-grid">
              {filteredCandidates.map((c) => (
                <div key={c.candidateId} className="panel-card panel-candidate-card">
                  <div className="panel-card-top-accent" data-round={c.roundType}></div>

                  <div className="panel-card-main">
                    <div className="panel-candidate-header">
                      <div className="panel-avatar-placeholder">
                        {c.fullName.charAt(0)}
                      </div>
                      <div className="panel-candidate-info-header">
                        <h4>{c.fullName}</h4>
                        <span className="panel-round-badge">{getRoundType(c.roundType)}</span>
                      </div>
                      <span className={`panel-status-badge ${c.attendanceStatus?.toLowerCase() || 'pending'}`}>
                        {c.attendanceStatus || 'Pending'}
                      </span>
                    </div>

                    <div className="panel-info-grid">
                      <div className="panel-info-item">
                        <span className="panel-label">Contact</span>
                        <div className="panel-value">
                          <i className="fa-solid fa-envelope"></i> {c.email}
                        </div>
                        <div className="panel-value">
                          <i className="fa-solid fa-phone"></i> {c.phone}
                        </div>
                      </div>

                      <div className="panel-info-item">
                        <span className="panel-label">Details</span>
                        <div className="panel-value">
                          <i className="fa-solid fa-graduation-cap"></i> {c.college}
                        </div>
                        <div className="panel-value">
                          <i className="fa-solid fa-briefcase"></i> {c.candidateExperienceLevel} years exp.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="panel-card-actions">
                    <button
                      className="panel-btn-primary"
                      onClick={() => navigate(`/panel/details/${c.candidateId}`)}
                    >
                      View Details
                    </button>
                    <button
                      className="panel-btn-outline"
                      onClick={() => navigate(`/panel/reassign/${c.candidateId}`)}
                    >
                      Reassign
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default PanelDashboard;
