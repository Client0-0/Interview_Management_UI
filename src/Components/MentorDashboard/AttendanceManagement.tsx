/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import "../Styles/AttendanceManagement.css";
import { FaExchangeAlt } from "react-icons/fa";
import { Outlet, useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";      // 🔇 commented out – backend

import type { MentorCandidate } from "../../Models/user";
// 🔇 Backend imports – uncomment when reconnecting to the API
// import {
//   getAllCandidatesAssignedMentor,
//   postMarkAttendance,
// } from "../../Services/User.Service";

/* ================= TYPES ================= */

interface DriveResponse {
  driveId: number;
  driveName: string;
  driveDate: string;
  candidates: MentorCandidate[];
}

// interface JwtPayload {
//   "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
// }

type AttendanceStatus = "Present" | "Absent";
type AttendanceKey = `${number}_${number}`;

/* ================= MOCK DATA ================= */

const MOCK_DRIVES: DriveResponse[] = [
  {
    driveId: 701,
    driveName: "Campus Drive - JNTU",
    driveDate: "2025-12-06",
    candidates: [
      { driveId: 701, driveName: "Campus Drive - JNTU", driveDate: "2025-12-06", candidateId: 801, fullName: "Sneha Reddy", email: "sneha.r@gmail.com", phone: "8765432100", address: "Hyderabad", college: "JNTU", previousCompany: "Infosys", status: 1, roundType: "1", roundStatus: "Scheduled", roundResult: "", interviewerName: "Suresh Kumar", interviewerEmail: "suresh.k@company.com", interviewerPhone: "9988776601", interviewerId: 301, candidateExperienceLevel: "2", techStack: ["React", "Node.js"], resumeUrl: "", linkedInUrl: "", gitHubUrl: "", userName: "", useremail: "", attendanceStatus: "Present" },
      { driveId: 701, driveName: "Campus Drive - JNTU", driveDate: "2025-12-06", candidateId: 802, fullName: "Karthik Iyer", email: "karthik.i@gmail.com", phone: "8765432101", address: "Chennai", college: "Anna University", previousCompany: "TCS", status: 1, roundType: "1", roundStatus: "Scheduled", roundResult: "", interviewerName: "Divya Menon", interviewerEmail: "divya.m@company.com", interviewerPhone: "9988776602", interviewerId: 302, candidateExperienceLevel: "3", techStack: ["Java", "Spring Boot"], resumeUrl: "", linkedInUrl: "", gitHubUrl: "", userName: "", useremail: "", attendanceStatus: null },
      { driveId: 701, driveName: "Campus Drive - JNTU", driveDate: "2025-12-06", candidateId: 803, fullName: "Meera Joshi", email: "meera.j@gmail.com", phone: "8765432102", address: "Pune", college: "COEP", previousCompany: "", status: 1, roundType: "2", roundStatus: "Scheduled", roundResult: "", interviewerName: "Amit Verma", interviewerEmail: "amit.v@company.com", interviewerPhone: "9988776605", interviewerId: 305, candidateExperienceLevel: "0", techStack: ["Python", "Django"], resumeUrl: "", linkedInUrl: "", gitHubUrl: "", userName: "", useremail: "", attendanceStatus: null },
      { driveId: 701, driveName: "Campus Drive - JNTU", driveDate: "2025-12-06", candidateId: 806, fullName: "Priya Nair", email: "priya.n@gmail.com", phone: "8765432105", address: "Kochi", college: "CUSAT", previousCompany: "", status: 1, roundType: "1", roundStatus: "Scheduled", roundResult: "", interviewerName: "Suresh Kumar", interviewerEmail: "suresh.k@company.com", interviewerPhone: "9988776601", interviewerId: 301, candidateExperienceLevel: "1", techStack: ["HTML", "CSS", "JavaScript"], resumeUrl: "", linkedInUrl: "", gitHubUrl: "", userName: "", useremail: "", attendanceStatus: null },
    ],
  },
  {
    driveId: 702,
    driveName: "Lateral Hiring - React",
    driveDate: "2025-12-08",
    candidates: [
      { driveId: 702, driveName: "Lateral Hiring - React", driveDate: "2025-12-08", candidateId: 804, fullName: "Rohan Das", email: "rohan.d@gmail.com", phone: "8765432103", address: "Bangalore", college: "RV College", previousCompany: "Wipro", status: 1, roundType: "1", roundStatus: "Scheduled", roundResult: "", interviewerName: "Rekha Gupta", interviewerEmail: "rekha.g@company.com", interviewerPhone: "9988776604", interviewerId: 304, candidateExperienceLevel: "4", techStack: ["Angular", ".NET"], resumeUrl: "", linkedInUrl: "", gitHubUrl: "", userName: "", useremail: "", attendanceStatus: "Present" },
      { driveId: 702, driveName: "Lateral Hiring - React", driveDate: "2025-12-08", candidateId: 805, fullName: "Aisha Khan", email: "aisha.k@gmail.com", phone: "8765432104", address: "Mumbai", college: "IIT Bombay", previousCompany: "Amazon", status: 1, roundType: "2", roundStatus: "Scheduled", roundResult: "", interviewerName: "Nikhil Rao", interviewerEmail: "nikhil.r@company.com", interviewerPhone: "9988776603", interviewerId: 303, candidateExperienceLevel: "5", techStack: ["AWS", "Microservices", "Go"], resumeUrl: "", linkedInUrl: "", gitHubUrl: "", userName: "", useremail: "", attendanceStatus: null },
      { driveId: 702, driveName: "Lateral Hiring - React", driveDate: "2025-12-08", candidateId: 807, fullName: "Vikram Singh", email: "vikram.s@gmail.com", phone: "8765432106", address: "Delhi", college: "DTU", previousCompany: "Cognizant", status: 1, roundType: "1", roundStatus: "Scheduled", roundResult: "", interviewerName: "Rekha Gupta", interviewerEmail: "rekha.g@company.com", interviewerPhone: "9988776604", interviewerId: 304, candidateExperienceLevel: "3", techStack: ["React", "TypeScript", "GraphQL"], resumeUrl: "", linkedInUrl: "", gitHubUrl: "", userName: "", useremail: "", attendanceStatus: null },
    ],
  },
  {
    driveId: 703,
    driveName: "Pool Drive - Full Stack",
    driveDate: "2025-12-10",
    candidates: [
      { driveId: 703, driveName: "Pool Drive - Full Stack", driveDate: "2025-12-10", candidateId: 808, fullName: "Deepika Sharma", email: "deepika.s@gmail.com", phone: "8765432107", address: "Jaipur", college: "MNIT", previousCompany: "HCL", status: 1, roundType: "1", roundStatus: "Scheduled", roundResult: "", interviewerName: "Amit Verma", interviewerEmail: "amit.v@company.com", interviewerPhone: "9988776605", interviewerId: 305, candidateExperienceLevel: "2", techStack: ["Vue.js", "Node.js", "MongoDB"], resumeUrl: "", linkedInUrl: "", gitHubUrl: "", userName: "", useremail: "", attendanceStatus: null },
      { driveId: 703, driveName: "Pool Drive - Full Stack", driveDate: "2025-12-10", candidateId: 809, fullName: "Rahul Mehta", email: "rahul.m@gmail.com", phone: "8765432108", address: "Ahmedabad", college: "DAIICT", previousCompany: "Accenture", status: 1, roundType: "1", roundStatus: "Scheduled", roundResult: "", interviewerName: "Divya Menon", interviewerEmail: "divya.m@company.com", interviewerPhone: "9988776602", interviewerId: 302, candidateExperienceLevel: "4", techStack: ["Java", "React", "AWS"], resumeUrl: "", linkedInUrl: "", gitHubUrl: "", userName: "", useremail: "", attendanceStatus: "Absent" },
    ],
  },
];

/* ================= COMPONENT ================= */

const AttendanceManagement: React.FC = () => {
  const navigate = useNavigate();

  const [drives, setDrives] = useState<DriveResponse[]>([]);
  const [attendance, setAttendance] = useState<
    Record<AttendanceKey, AttendanceStatus>
  >({});
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedDrive, setSelectedDrive] = useState<string>("All");
  const [showDriveFilter, setShowDriveFilter] = useState(false);

  /* ================= LOAD DATA (MOCK) ================= */

  useEffect(() => {
    // 🔇 Original backend logic commented out – uncomment to reconnect
    // const loadData = async () => {
    //   try {
    //     const token = localStorage.getItem("token");
    //     if (!token) return;
    //     const decoded = jwtDecode<JwtPayload>(token);
    //     const mentorId = parseInt(
    //       decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"], 10
    //     );
    //     if (isNaN(mentorId)) return;
    //     const response = await getAllCandidatesAssignedMentor(mentorId);
    //     const driveData: DriveResponse[] = response.data.data;
    //     setDrives(driveData);
    //     const attendanceMap: Record<AttendanceKey, AttendanceStatus> = {};
    //     driveData.forEach(drive => {
    //       drive.candidates.forEach(candidate => {
    //         if (candidate.attendanceStatus) {
    //           const key: AttendanceKey = `${drive.driveId}_${candidate.candidateId}`;
    //           attendanceMap[key] = candidate.attendanceStatus;
    //         }
    //       });
    //     });
    //     setAttendance(attendanceMap);
    //   } catch (error) {
    //     console.error("Error loading attendance data", error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // loadData();

    /* 🟢 MOCK: use static data */
    const driveData = MOCK_DRIVES;
    setDrives(driveData);

    const attendanceMap: Record<AttendanceKey, AttendanceStatus> = {};
    driveData.forEach(drive => {
      drive.candidates.forEach(candidate => {
        if (candidate.attendanceStatus) {
          const key: AttendanceKey = `${drive.driveId}_${candidate.candidateId}`;
          attendanceMap[key] = candidate.attendanceStatus;
        }
      });
    });
    setAttendance(attendanceMap);
    setLoading(false);
  }, []);

  /* ================= ATTENDANCE (MOCK – local only) ================= */

  const handleMarkAttendance = (
    driveId: number,
    candidateId: number,
    attendanceStatus: AttendanceStatus
  ) => {
    // 🔇 Original backend call commented out
    // try {
    //   const payload = { driveId, candidateId, attendanceStatus };
    //   await postMarkAttendance(payload);
    //   const key: AttendanceKey = `${driveId}_${candidateId}`;
    //   setAttendance(prev => ({ ...prev, [key]: attendanceStatus }));
    // } catch (error) {
    //   console.error("Failed to mark attendance", error);
    // }

    /* 🟢 MOCK: update state locally */
    const key: AttendanceKey = `${driveId}_${candidateId}`;
    setAttendance(prev => ({
      ...prev,
      [key]: attendanceStatus,
    }));
  };

  /* ================= FILTERING ================= */

  const filteredDrives = drives.filter(drive => {
    if (selectedDrive === "All") return true;
    return drive.driveName === selectedDrive;
  });

  const filteredData = filteredDrives.map(drive => ({
    ...drive,
    candidates: drive.candidates.filter(c =>
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    ),
  }));

  /* ================= COMPUTED STATS ================= */

  const allCandidates = filteredData.flatMap(d => d.candidates);
  const totalCandidates = allCandidates.length;
  const presentCount = allCandidates.filter(c => {
    const key: AttendanceKey = `${c.driveId}_${c.candidateId}`;
    return attendance[key] === "Present";
  }).length;
  const absentCount = allCandidates.filter(c => {
    const key: AttendanceKey = `${c.driveId}_${c.candidateId}`;
    return attendance[key] === "Absent";
  }).length;
  const pendingCount = totalCandidates - presentCount - absentCount;

  if (loading) {
    return (
      <div className="attendance-loading">
        <div className="spinner" />
        <p>Loading candidates…</p>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="attendance-page">
      <div className="attendance-inner">

        {/* PAGE HEADER */}
        <div className="attendance-page-header">
          <h1>Manage Attendance</h1>
          <p>Mark attendance &amp; manage panels for your assigned drives</p>
        </div>

        {/* STATS STRIP */}
        <div className="attendance-stats-strip">
          <div className="att-stat-card">
            <div className="att-stat-icon total">
              <i className="fa-solid fa-users" />
            </div>
            <div className="att-stat-info">
              <span className="att-stat-label">Total</span>
              <span className="att-stat-value">{totalCandidates}</span>
            </div>
          </div>
          <div className="att-stat-card">
            <div className="att-stat-icon present">
              <i className="fa-solid fa-circle-check" />
            </div>
            <div className="att-stat-info">
              <span className="att-stat-label">Present</span>
              <span className="att-stat-value">{presentCount}</span>
            </div>
          </div>
          <div className="att-stat-card">
            <div className="att-stat-icon absent">
              <i className="fa-solid fa-circle-xmark" />
            </div>
            <div className="att-stat-info">
              <span className="att-stat-label">Absent</span>
              <span className="att-stat-value">{absentCount}</span>
            </div>
          </div>
          <div className="att-stat-card">
            <div className="att-stat-icon pending">
              <i className="fa-solid fa-clock" />
            </div>
            <div className="att-stat-info">
              <span className="att-stat-label">Pending</span>
              <span className="att-stat-value">{pendingCount}</span>
            </div>
          </div>
        </div>

        {/* SEARCH + FILTER */}
        <div className="search-filter-row">
          <input
            className="search-input"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="filter-wrapper">
            <button
              className="filter-btn"
              onClick={() => setShowDriveFilter(prev => !prev)}
            >
              <i className="fa-solid fa-filter" />
              {selectedDrive === "All" ? "All Drives" : selectedDrive}
            </button>

            {showDriveFilter && (
              <div className="drive-dropdown">
                <div
                  className="drive-item"
                  onClick={() => {
                    setSelectedDrive("All");
                    setShowDriveFilter(false);
                  }}
                >
                  All Drives
                </div>

                {drives.map(d => (
                  <div
                    key={d.driveId}
                    className="drive-item"
                    onClick={() => {
                      setSelectedDrive(d.driveName);
                      setShowDriveFilter(false);
                    }}
                  >
                    {d.driveName}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* DRIVE WISE DATA */}
        {filteredData.every(d => d.candidates.length === 0) && (
          <div className="empty-state">
            <i className="fa-solid fa-clipboard-list" />
            <p>No candidates found matching your search.</p>
          </div>
        )}

        {filteredData.map(drive =>
          drive.candidates.length > 0 && (
            <div key={drive.driveId} className="drive-section">
              <h2 className="drive-header-title">
                {drive.driveName}
                <span className="drive-date-badge">
                  <i className="fa-regular fa-calendar" /> {drive.driveDate}
                </span>
              </h2>

              <div className="candidates-grid">
                {drive.candidates.map(c => {
                  const attendanceKey: AttendanceKey =
                    `${drive.driveId}_${c.candidateId}`;
                  const initials = c.fullName
                    .split(" ")
                    .map(n => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <div key={c.candidateId} className="candidate-card">
                      <div className="card-accent-bar" />
                      <div className="card-body">

                        {/* CANDIDATE HEADER */}
                        <div className="card-header-row">
                          <div className="avatar-circle">{initials}</div>
                          <div className="candidate-name-block">
                            <h3>{c.fullName}</h3>
                            <span className="round">
                              Round {c.roundType ?? "-"}
                            </span>
                          </div>
                        </div>

                        {/* CONTACT INFO */}
                        <div className="card-contact">
                          <p>
                            <i className="fa-regular fa-envelope" />
                            {c.email}
                          </p>
                          <p>
                            <i className="fa-solid fa-phone" />
                            {c.phone}
                          </p>
                        </div>

                        {/* PANEL INFO */}
                        <div className="card-panel-info">
                          <p>
                            Panel: <b>{c.interviewerName ?? "Not Assigned"}</b>
                          </p>
                          <button
                            className="reassign-btn-right"
                            onClick={() => {
                              navigate(
                                `/mentor/reassignpanel/${c.candidateId}`,
                                {
                                  state: {
                                    candidate: c,
                                    driveId: drive.driveId,
                                    driveName: drive.driveName,
                                    candidateName: c.fullName,
                                    Round: c.roundType,
                                  },
                                }
                              );
                            }}
                          >
                            <FaExchangeAlt size={13} /> Reassign
                          </button>
                        </div>

                        {/* ATTENDANCE */}
                        <div className="attendance-row">
                          {!attendance[attendanceKey] ? (
                            <div className="attendance-buttons">
                              <button
                                className="present-btn"
                                onClick={() =>
                                  handleMarkAttendance(
                                    drive.driveId,
                                    c.candidateId,
                                    "Present"
                                  )
                                }
                              >
                                <i className="fa-solid fa-check" /> Present
                              </button>

                              <button
                                className="absent-btn"
                                onClick={() =>
                                  handleMarkAttendance(
                                    drive.driveId,
                                    c.candidateId,
                                    "Absent"
                                  )
                                }
                              >
                                <i className="fa-solid fa-xmark" /> Absent
                              </button>
                            </div>
                          ) : (
                            <div
                              className={`marked-attendance status-${attendance[attendanceKey].toLowerCase()}`}
                            >
                              <span>
                                <b>{attendance[attendanceKey]}</b>
                              </span>
                              <button
                                className="change-btn"
                                onClick={() =>
                                  setAttendance(prev => {
                                    const copy = { ...prev };
                                    delete copy[attendanceKey];
                                    return copy;
                                  })
                                }
                              >
                                Change
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        )}
      </div>
      <Outlet />
    </div>
  );
};

export default AttendanceManagement;

