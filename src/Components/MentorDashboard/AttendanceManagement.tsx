/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import "../Styles/AttendanceManagement.css";
import { FaExchangeAlt } from "react-icons/fa";
import { Outlet, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import type { MentorCandidate } from "../../Models/user";
import {
  getAllCandidatesAssignedMentor,
  postMarkAttendance,
} from "../../Services/User.Service";

/* ================= TYPES ================= */

interface DriveResponse {
  driveId: number;
  driveName: string;
  driveDate: string;
  candidates: MentorCandidate[];
}

interface JwtPayload {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
}

type AttendanceStatus = "Present" | "Absent";
type AttendanceKey = `${number}_${number}`;

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

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode<JwtPayload>(token);
        const mentorId = parseInt(
          decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ],
          10
        );

        if (isNaN(mentorId)) return;

        const response = await getAllCandidatesAssignedMentor(mentorId);
        const driveData: DriveResponse[] = response.data.data;

        setDrives(driveData);

        /* 🔥 BUILD ATTENDANCE FROM BACKEND */
        const attendanceMap: Record<AttendanceKey, AttendanceStatus> = {};

        driveData.forEach(drive => {
          drive.candidates.forEach(candidate => {
            if (candidate.attendanceStatus) {
              const key: AttendanceKey =
                `${drive.driveId}_${candidate.candidateId}`;
              attendanceMap[key] = candidate.attendanceStatus;
            }
          });
        });

        setAttendance(attendanceMap);
      } catch (error) {
        console.error("Error loading attendance data", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /* ================= ATTENDANCE ================= */

  const handleMarkAttendance = async (
    driveId: number,
    candidateId: number,
    attendanceStatus: AttendanceStatus
  ) => {
    try {
      const payload = {
        driveId,
        candidateId,
        attendanceStatus,
      };

      await postMarkAttendance(payload);

      const key: AttendanceKey = `${driveId}_${candidateId}`;

      setAttendance(prev => ({
        ...prev,
        [key]: attendanceStatus,
      }));
    } catch (error) {
      console.error("Failed to mark attendance", error);
    }
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

  if (loading) return <p>Loading candidates...</p>;

  /* ================= UI ================= */

  return (
    <div className="dashboard-container">
      <div className="attendanceParagraph">

        {/* SEARCH + FILTER */}
        <div className="search-filter-row">
          <input
            className="search-input"
            placeholder="Search candidate by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="filter-wrapper">
            <button
              className="filter-btn"
              onClick={() => setShowDriveFilter(prev => !prev)}
            >
              Filter
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
                  All
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

        <p>Mark Attendance & Manage Panels</p>

        {/* DRIVE WISE DATA */}
        {filteredData.map(drive =>
          drive.candidates.length > 0 && (
            <div key={drive.driveId}>
              <h2 className="drive-header-title">{drive.driveName}</h2>

              {drive.candidates.map(c => {
                const attendanceKey: AttendanceKey =
                  `${drive.driveId}_${c.candidateId}`;

                return (
                  <div key={c.candidateId} className="candidate-card">

                    {/* TOP SECTION */}
                    <div className="top-section">
                      <div className="candidate-left">
                        <h3>
                          {c.fullName}
                          <span className="round">
                            {` Round ${c.roundType ?? "-"}`}
                          </span>
                        </h3>
                        <p>Email: {c.email}</p>
                        <p>Phone: {c.phone}</p>
                      </div>

                      <div className="panel-right">
                        <p>
                          Panel: <b>{c.interviewerName ?? "Not Assigned"}</b>
                        </p>

                       <button
                        className="reassign-btn-right"
                        onClick={() => {navigate(`/mentor/reassignpanel/${c.candidateId}`,{
                          state:{
                            candidate:c,
                            driveId: drive.driveId,
                            driveName: drive.driveName,
                            candidateName: c.fullName,
                            Round: c.roundType,
                          }
                        })}}
                      >
                        <FaExchangeAlt size={16} /> Reassign Panel
                      </button>
                      </div>
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
                            Mark Present
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
                            Mark Absent
                          </button>
                        </div>
                      ) : (
                        <div className="marked-attendance">
                          Attendance marked as{" "}
                          <b>{attendance[attendanceKey]}</b>

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
                );
              })}
            </div>
          )
        )}
      </div>
       <Outlet />
    </div>
  );
};

export default AttendanceManagement;
