import React, { useEffect, useMemo, useState } from "react";

import { notifyError } from "../../../Utils/toastHelper";
import {
  getAllCandidates,
} from "../../../Services/User.Service";

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import type { CandidateDto } from "../../../Models/user";



const Candidates: React.FC = () => {
  const [candidates, setCandidates] = useState<CandidateDto[]>([]);
  const [loading, setLoading] = useState(true);

  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  /* ================= FETCH ================= */
  useEffect(() => {
    fetchCandidates();
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [location.pathname]);

  const fetchCandidates = async () => {
    try {
      const res = await getAllCandidates();
      const list = Array.isArray(res.data?.data) ? res.data.data : res.data;
      setCandidates(list || []);
    } catch {
      notifyError("Failed to load candidates");
      // ─── Mock fallback (no backend) ───
      setCandidates([
        { candidateId: 201, fullName: "Sneha Reddy", email: "sneha.r@gmail.com", phone: "8765432100", address: "Hyderabad", college: "JNTU", previousCompany: "Infosys", candidateExperienceLevel: "2", techStack: ["React", "Node.js"], resumeUrl: "", linkedInUrl: "", gitHubUrl: "", createdDate: "2025-11-01T00:00:00" },
        { candidateId: 202, fullName: "Karthik Iyer", email: "karthik.i@gmail.com", phone: "8765432101", address: "Chennai", college: "Anna University", previousCompany: "TCS", candidateExperienceLevel: "3", techStack: ["Java", "Spring Boot"], resumeUrl: "", linkedInUrl: "", gitHubUrl: "", createdDate: "2025-11-05T00:00:00" },
        { candidateId: 203, fullName: "Meera Joshi", email: "meera.j@gmail.com", phone: "8765432102", address: "Pune", college: "COEP", previousCompany: "Freshers", candidateExperienceLevel: "0", techStack: ["Python", "Django"], resumeUrl: "", linkedInUrl: "", gitHubUrl: "", createdDate: "2025-11-10T00:00:00" },
        { candidateId: 204, fullName: "Rohan Das", email: "rohan.d@gmail.com", phone: "8765432103", address: "Bangalore", college: "RV College", previousCompany: "Wipro", candidateExperienceLevel: "4", techStack: ["Angular", ".NET"], resumeUrl: "", linkedInUrl: "", gitHubUrl: "", createdDate: "2025-11-15T00:00:00" },
        { candidateId: 205, fullName: "Aisha Khan", email: "aisha.k@gmail.com", phone: "8765432104", address: "Mumbai", college: "IIT Bombay", previousCompany: "Amazon", candidateExperienceLevel: "5", techStack: ["AWS", "Microservices", "Go"], resumeUrl: "", linkedInUrl: "", gitHubUrl: "", createdDate: "2025-11-20T00:00:00" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEARCH FILTER ================= */
  const filteredCandidates = useMemo(() => {
    const term = search.toLowerCase().trim();
    return candidates.filter(
      (c) =>
        c.fullName?.toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term)
    );
  }, [candidates, search]);

  /* ================= VIEW ================= */
  // const handleView = async (candidateId: number) => {
  //   try {
  //     const res = await getCandidateById(candidateId);
  //     setSelectedCandidate(res.data.data);
  //   } catch {
  //     notifyError("Failed to fetch candidate details");
  //   }
  // };

  /* ================= EDIT SAVE ================= */
  // const handleSaveEdit = async (payload: UpdateCandidatePatchRequest) => {
  //   try {
  //     await updateCandidate(payload);
  //     notifySuccess("Candidate updated successfully");

  //     setCandidates((prev) =>
  //       prev.map((c) =>
  //         c.candidateId === payload.candidateId
  //           ? { ...c, ...payload }
  //           : c
  //       )
  //     );
  //     setEditCandidate(null);
  //   } catch {
  //     notifyError("Failed to update candidate");
  //   }
  // };


  if (loading) return <p>Loading candidates...</p>;

  return (
    <section className="users-page" onClick={() => setOpenMenu(null)}>
      <div className="mb-6">
        <h1>Candidate Management</h1>
        <p className="text-muted">Add and manage candidates in the system.</p>
      </div>

      {/* TOOLBAR */}
      <div className="users-toolbar">
        <div className="input-box" style={{ flex: 1, minWidth: '300px' }}>
          <i className="fa-solid fa-search input-icon"></i>
          <input
            className=""
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="right-actions">
          <button className="btn secondary" onClick={() => navigate("bulkupload")}>
            <i className="fa-solid fa-file-arrow-up"></i>
            Bulk Upload
          </button>
          <button className="btn primary" onClick={() => navigate("addcandidate")}>
            <i className="fa-solid fa-plus"></i>
            Add Candidate
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Applied Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No candidates found
                </td>
              </tr>
            )}

            {filteredCandidates.map((c, index) => (
              <tr key={c.candidateId}>
                <td><div className="font-medium">{c.fullName || "-"}</div></td>
                <td className="text-muted">{c.email || "-"}</td>
                <td className="text-muted">{c.phone || "-"}</td>
                <td className="text-muted text-sm">{c.createdDate ? new Date(c.createdDate).toLocaleDateString() : "-"}</td>
                <td className="actions-cell">
                  <div
                    className="menu-container"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="menu-btn"
                      onClick={() =>
                        setOpenMenu(openMenu === index ? null : index)
                      }
                    >
                      <i className="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                    {openMenu === index && (
                      <div className="menu-dropdown">
                        <button
                          className="menu-item view-btn"
                          onClick={() => {
                            navigate("viewcandidate", { state: c });
                            setOpenMenu(null);
                          }}
                        >
                          <i className="fa-solid fa-eye"></i> <span>View Details</span>
                        </button>
                        <button
                          className="menu-item edit-btn"
                          onClick={() => {
                            navigate(`editcandidate/${c.candidateId}`);
                            setOpenMenu(null);
                          }}
                        >
                          <i className="fa-solid fa-pen"></i><span>Edit Candidate</span>
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Outlet />

      {/* MODALS */}
    </section>

  );
};

export default Candidates;
