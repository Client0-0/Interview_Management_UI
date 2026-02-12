/* eslint-disable @typescript-eslint/no-unused-vars */
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
    <div className="app-container">
      <div className="dashboard-content-wrapper dashboard-container">
        <div className="dashboardcolor">

          {/* Date */}
          <p className="dashboard-date">Saturday, December 6, 2025</p>

          {/* Stats */}
          <div className="stats-container">
            <div className="stat-card total">
              <FaClipboardList className="stat-icon" />
              <div className="stat-info">
                <h4>Total Today</h4>
                <p>{candidates.length}</p>
                <p>Candidates Scheduled</p>
              </div>
            </div>

            <div className="stat-card present">
              <FaCalendarCheck className="stat-icon" />
              <div className="stat-info">
                <h4>Present</h4>
                <p>
                  {
                    candidates.filter(
                      c => c.attendanceStatus?.toLowerCase() === "present"
                    ).length
                  }
                </p>
                <p>Attendance Marked</p>
              </div>
            </div>

            <div className="stat-card pending">
              <FaClock className="stat-icon" />
              <div className="stat-info">
                <h4>Pending</h4>
                <p>
                  {
                    candidates.filter(
                      c => c.attendanceStatus?.toLowerCase() === "pending"
                    ).length
                  }
                </p>
                <p>Attendance Pending</p>
              </div>
            </div>

            <div className="stat-card panels">
              <FaUsers className="stat-icon" />
              <div className="stat-info">
                <h4>Panels</h4>
                <p>4</p>
                <p>Available Today</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="fast-container">
            <p className="fast-title">Quick Action</p>
            <div className="quick-actions">
              <button
                className="action-btn manage"
                onClick={() => navigate("attendance")}
              >
                <FaClipboardList className="action-icon" />
                <div>
                  <strong>Manage Attendance</strong>
                  <p>Mark attendance & assign panels</p>
                </div>
              </button>

              <button className="action-btn view">
                <FaUsers className="action-icon" />
                <div>
                  <strong>View Panel Schedule</strong>
                  <p>Check room allocations</p>
                </div>
              </button>
            </div>
          </div>

          {/* Filter */}
          <div className="filter-bar">
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
                <option key={d.driveId} value={d.driveId}>
                  {d.driveName}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Search candidate..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          {/* Candidate Cards */}
          <div className="candidate-page-wrapper">
            <div className="candidate-scroll-container">
              <div className="container-fluid">
                <div className="row g-4 candidate-grid">
                  {filteredCandidates.map(item => (
                    <div
                      key={`${item.candidateId}-${item.interviewerId}`}
                      className="col-12 col-md-6 col-lg-4"
                    >
                      <div className="candidate-card">

                        <div className="card-header-custom">
                          <h6 className="">
                            <i className="fa fa-user"></i>
                            {item.fullName}
                          </h6>
                          <span className="">
                            {getRoundType(item.roundType)}
                          </span>
                        </div>

                        <div className="card-body-custom">
                          <div className="card-section">
                            <p className="section-title">Candidate</p>
                            <p><i className="fa fa-envelope icon-email"></i>{item.email}</p>
                            <p><i className="fa fa-phone icon-phone"></i>{item.phone}</p>
                          </div>
                          
                          <div className="card-section">
                            <p className="section-title">Interviewer</p>
                            {item.interviewerName ? (
                              <>
                                <p><i className="fa fa-user-tie icon-interviewer"></i>{item.interviewerName}</p>
                                <p><i className="fa fa-envelope icon-email"></i>{item.interviewerEmail}</p>
                                <p><i className="fa fa-phone icon-phone"></i>{item.interviewerPhone}</p>
                              </>
                            ) : (
                              <p className="not-assigned"><i className="fa fa-ban"></i>Not Assigned</p>
                            )}
                          </div>
                        </div>

                        <div className="card-footer-custom">
                          <span
                            className={`status-pill status-${item.attendanceStatus?.toLowerCase() || "pending"}`}
                          >
                            {item.attendanceStatus ?? "Pending"}
                          </span>
                          <button className="btn btn-sm btn-outline-primary">
                            View
                          </button>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default MentorDashboard;
