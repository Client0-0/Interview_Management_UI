 
import React, { useEffect, useState } from "react";
import "../Styles/MentorDashboard.css";
import {
  FaUsers,
  FaCalendarCheck,
  FaClock,
  FaClipboardList,
} from "react-icons/fa";
import { Outlet, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getAllCandidatesAssignedMentor } from "../../Services/User.Service";
import type { MentorCandidate } from "../../Models/user";

/* ================= JWT TYPE ================= */
interface JwtPayload {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
}

/* ================= DRIVE RESPONSE TYPE ================= */
interface DriveResponse {
  driveId: number;
  driveName: string;
  driveDate: string;
  candidates: MentorCandidate[];
}

const MentorDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState<MentorCandidate[]>([]);
  const [drives, setDrives] = useState<DriveResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token not found");
          return;
        }

        // If mock token, skip JWT decode and use mock data
        const rawToken = token.replace(/^"/, "").replace(/"$/, "");
        if (rawToken === "mock-token") {
          throw new Error("Mock token – use fallback data");
        }

        const decoded = jwtDecode<JwtPayload>(token);
        const mentorId = parseInt(
          decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ],
          10
        );

        if (isNaN(mentorId)) {
          console.error("Invalid mentorId");
          return;
        }

        const response = await getAllCandidatesAssignedMentor(mentorId);
        const driveData: DriveResponse[] = response.data.data;

        setTimeout(() => {
          setDrives(driveData);

          const allCandidates = driveData.flatMap(d => d.candidates);
          setCandidates(allCandidates);
          setLoading(false);
        }, 500); // Simulate loading delay
      } catch (error) {
        console.error("Error fetching candidate list:", error);
        // ─── Mock fallback (no backend) ───
        const mockDrives: DriveResponse[] = [
          {
            driveId: 701, driveName: "Campus Drive - JNTU", driveDate: "2025-12-06",
            candidates: [
              { driveId: 701, driveName: "Campus Drive - JNTU", driveDate: "2025-12-06", candidateId: 801, fullName: "Sneha Reddy", email: "sneha.r@gmail.com", phone: "8765432100", address: "Hyderabad", college: "JNTU", previousCompany: "Infosys", status: 1, roundType: "1", roundStatus: "Scheduled", roundResult: "", interviewerName: "Suresh Kumar", interviewerEmail: "suresh.k@company.com", interviewerPhone: "9988776601", interviewerId: 301, candidateExperienceLevel: "2", techStack: ["React", "Node.js"], resumeUrl: "", linkedInUrl: "", gitHubUrl: "", userName: "", useremail: "", attendanceStatus: "Present" },
              { driveId: 701, driveName: "Campus Drive - JNTU", driveDate: "2025-12-06", candidateId: 802, fullName: "Karthik Iyer", email: "karthik.i@gmail.com", phone: "8765432101", address: "Chennai", college: "Anna University", previousCompany: "TCS", status: 1, roundType: "1", roundStatus: "Scheduled", roundResult: "", interviewerName: "Divya Menon", interviewerEmail: "divya.m@company.com", interviewerPhone: "9988776602", interviewerId: 302, candidateExperienceLevel: "3", techStack: ["Java", "Spring Boot"], resumeUrl: "", linkedInUrl: "", gitHubUrl: "", userName: "", useremail: "", attendanceStatus: null },
              { driveId: 701, driveName: "Campus Drive - JNTU", driveDate: "2025-12-06", candidateId: 803, fullName: "Meera Joshi", email: "meera.j@gmail.com", phone: "8765432102", address: "Pune", college: "COEP", previousCompany: "", status: 1, roundType: "2", roundStatus: "Scheduled", roundResult: "", interviewerName: "", interviewerEmail: "", interviewerPhone: "", interviewerId: 0, candidateExperienceLevel: "0", techStack: ["Python", "Django"], resumeUrl: "", linkedInUrl: "", gitHubUrl: "", userName: "", useremail: "", attendanceStatus: "Present" },
            ],
          },
          {
            driveId: 702, driveName: "Lateral Hiring - React", driveDate: "2025-12-06",
            candidates: [
              { driveId: 702, driveName: "Lateral Hiring - React", driveDate: "2025-12-06", candidateId: 804, fullName: "Rohan Das", email: "rohan.d@gmail.com", phone: "8765432103", address: "Bangalore", college: "RV College", previousCompany: "Wipro", status: 1, roundType: "1", roundStatus: "Scheduled", roundResult: "", interviewerName: "Rekha Gupta", interviewerEmail: "rekha.g@company.com", interviewerPhone: "9988776604", interviewerId: 304, candidateExperienceLevel: "4", techStack: ["Angular", ".NET"], resumeUrl: "", linkedInUrl: "", gitHubUrl: "", userName: "", useremail: "", attendanceStatus: null },
              { driveId: 702, driveName: "Lateral Hiring - React", driveDate: "2025-12-06", candidateId: 805, fullName: "Aisha Khan", email: "aisha.k@gmail.com", phone: "8765432104", address: "Mumbai", college: "IIT Bombay", previousCompany: "Amazon", status: 1, roundType: "2", roundStatus: "Scheduled", roundResult: "", interviewerName: "Nikhil Rao", interviewerEmail: "nikhil.r@company.com", interviewerPhone: "9988776603", interviewerId: 303, candidateExperienceLevel: "5", techStack: ["AWS", "Microservices", "Go"], resumeUrl: "", linkedInUrl: "", gitHubUrl: "", userName: "", useremail: "", attendanceStatus: "Present" },
            ],
          },
        ];
        setDrives(mockDrives);
        setCandidates(mockDrives.flatMap(d => d.candidates));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  if (loading) return <div className="loading-text">Loading...</div>;

  /* ================= UI ================= */
  return (
    <div className="mentor-dashboard-container">
      <div className="content-wrapper">

        {/* Header Section */}
        <header className="dashboard-header">
          <div>
            <h1>Welcome back, Mentor</h1>
            <p className="subtitle">Here's your schedule for today, {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="stats-grid">
          <div className="minimal-card stat-card">
            <div className="stat-icon-wrapper info">
              <FaClipboardList />
            </div>
            <div className="stat-content">
              <span className="stat-label">Scheduled Today</span>
              <strong className="stat-value">{candidates.length}</strong>
            </div>
          </div>

          <div className="minimal-card stat-card">
            <div className="stat-icon-wrapper success">
              <FaCalendarCheck />
            </div>
            <div className="stat-content">
              <span className="stat-label">Present</span>
              <strong className="stat-value">
                {candidates.filter(c => c.attendanceStatus?.toLowerCase() === "present").length}
              </strong>
            </div>
          </div>

          <div className="minimal-card stat-card">
            <div className="stat-icon-wrapper warning">
              <FaClock />
            </div>
            <div className="stat-content">
              <span className="stat-label">Pending</span>
              <strong className="stat-value">
                {candidates.filter(c => c.attendanceStatus?.toLowerCase() === "pending").length}
              </strong>
            </div>
          </div>

          <div className="minimal-card stat-card">
            <div className="stat-icon-wrapper primary">
              <FaUsers />
            </div>
            <div className="stat-content">
              <span className="stat-label">Panels Available</span>
              <strong className="stat-value">4</strong>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions-section">
          <h3 className="section-title">Quick Actions</h3>
          <div className="actions-grid">
            <button className="minimal-card action-card" onClick={() => navigate("attendance")}>
              <div className="action-icon-wrapper">
                <FaClipboardList />
              </div>
              <div className="action-details">
                <strong>Manage Attendance</strong>
                <p>Mark attendance & assign panels</p>
              </div>
              <i className="fa-solid fa-chevron-right arrow-icon"></i>
            </button>

            <button className="minimal-card action-card">
              <div className="action-icon-wrapper">
                <FaUsers />
              </div>
              <div className="action-details">
                <strong>View Panel Schedule</strong>
                <p>Check room allocations</p>
              </div>
              <i className="fa-solid fa-chevron-right arrow-icon"></i>
            </button>
          </div>
        </section>

        {/* Filter & Search */}
        <section className="filter-section">
          <div className="search-filter-container">
            <div className="search-box">
              <i className="fa-solid fa-search"></i>
              <input
                type="text"
                placeholder="Search candidates by name, email..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            <div className="filter-box">
              <select
                onChange={(e) => {
                  const driveId = Number(e.target.value);
                  if (driveId === 0) {
                    setCandidates(drives.flatMap(d => d.candidates));
                  } else {
                    const drive = drives.find(d => d.driveId === driveId);
                    setCandidates(drive?.candidates || []);
                  }
                }}
              >
                <option value={0}>All Drives</option>
                {drives.map(d => (
                  <option key={d.driveId} value={d.driveId}>{d.driveName}</option>
                ))}
              </select>
            </div>

            <button
              className="availability-btn"
              onClick={() => navigate("availability")}
            >
              <i className="fa-regular fa-calendar-check" /> Set Availability
            </button>
          </div>
        </section>

        {/* Candidates Grid */}
        <section className="candidates-section">
          <h3 className="section-title">Upcoming Interviews</h3>

          <div className="candidates-scroll-container">
            <div className="candidates-grid">
              {filteredCandidates.map(item => (
                <div key={`${item.candidateId}-${item.interviewerId}`} className="minimal-card candidate-card-minimal">
                  <div className="card-top-accent" data-round={item.roundType}></div>

                  <div className="card-main">
                    <div className="candidate-header">
                      <div className="avatar-placeholder">
                        {item.fullName.charAt(0)}
                      </div>
                      <div className="candidate-info-header">
                        <h4>{item.fullName}</h4>
                        <span className="round-badge">{getRoundType(item.roundType)}</span>
                      </div>
                      <span className={`status-badge ${item.attendanceStatus?.toLowerCase() || 'pending'}`}>
                        {item.attendanceStatus || 'Pending'}
                      </span>
                    </div>

                    <div className="info-grid">
                      {/* CONTACT SECTION */}
                      <div className="info-item">
                        <span className="section-label">Contact</span>
                        <div className="info-value">
                          <i className="fa-solid fa-envelope"></i> {item.email}
                        </div>
                        <div className="info-value">
                          <i className="fa-solid fa-phone"></i> {item.phone}
                        </div>
                      </div>

                      {/* DETAILS SECTION */}
                      <div className="info-item">
                        <span className="section-label">Details</span>
                        <div className="info-value">
                          <i className="fa-solid fa-graduation-cap"></i> {item.college || "N/A"}
                        </div>
                        <div className="info-value">
                          <i className="fa-solid fa-briefcase"></i> {item.candidateExperienceLevel || "0"} years exp.
                        </div>
                      </div>

                      {/* INTERVIEWER SECTION */}
                      <div className="info-item">
                        <span className="section-label">Interviewer</span>
                        {item.interviewerName ? (
                          <div className="info-value highlight">
                            <i className="fa-solid fa-user-tie"></i> {item.interviewerName}
                          </div>
                        ) : (
                          <div className="info-value text-muted">
                            <i className="fa-solid fa-ban"></i> Not Assigned
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button
                      className="btn-primary"
                      onClick={() => navigate(`details/${item.candidateId}`, { state: { candidate: item } })}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
      <Outlet />
    </div>
  );
};

export default MentorDashboard;
