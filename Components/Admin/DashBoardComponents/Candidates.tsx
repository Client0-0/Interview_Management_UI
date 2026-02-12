import React, { useEffect, useMemo, useState } from "react";

import {  notifyError } from "../../../Utils/toastHelper";
import {
  getAllCandidates,
} from "../../../Services/User.Service";
import "./Styles/UserManagement.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import type { CandidateDto } from "../../../Models/user";



const Candidates: React.FC = () => {
  const [candidates, setCandidates] = useState<CandidateDto[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  
  const navigate=useNavigate();
  const location=useLocation();
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
    <section className="panels-page" onClick={() => setOpenMenu(null)}>
      <h2>Candidate Management</h2>
      <p className="muted">Add and manage candidates</p>

      {/* TOOLBAR */}
      <div className="users-toolbar">
        <input
          className="wide-search"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="right-actions">
          <button className="btn" onClick={() => navigate("bulkupload")}>
            Bulk Upload
          </button>
          <button className="btn primary" onClick={() => navigate("addcandidate")}>
            Add Candidate
          </button>
        </div>
      </div>

      {/* TABLE */}
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
              <td colSpan={5} className="empty-cell">
                No candidates found
              </td>
            </tr>
          )}

          {filteredCandidates.map((c, index) => (
            <tr key={c.candidateId}>
              <td>{c.fullName || "-"}</td>
              <td>{c.email || "-"}</td>
              <td>{c.phone || "-"}</td>
              <td>{c.createdDate || "-"}</td>
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
                    ···
                  </button>
                  {openMenu === index && (
                    <div className="menu-dropdown">
                      <button
                        className="menu-item"
                        onClick={() => navigate("viewcandidate",{state:c})}
                      >
                      <i className="fa-solid fa-eye"></i> <span>View</span>
                      </button>
                      <button
                        className="menu-item view-btn primary-btn"
                        onClick={() => navigate(`editcandidate/${c.candidateId}`)}
                      >
                      <i className="fa-solid fa-pen"></i><span>Edit</span>
                      </button>
                      
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        <Outlet />

      {/* MODALS */}
    </section>
    
  );
};

export default Candidates;
