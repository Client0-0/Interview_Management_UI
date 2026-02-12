/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import "./Styles/DriveMembers.css";
import {
  getAllCandidates,
  
  getDriveCandidates,
  addDriveCandidates,
  removeDriveCandidates,
} from "../../../../../Services/User.Service";
import type { DriveOutletContext } from "../DriveView";
import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";


interface RemoveTarget {
  candidateId: number;
  candidateName: string;
  candidateEmail: string;
}

const DriveCandidates: React.FC = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [availableCandidates, setAvailableCandidates] = useState<any[]>([]);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<number[]>([]);

  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const [showRemove, setShowRemove] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<RemoveTarget | null>(null);
  const navigate = useNavigate();

  const {
    driveId,
    isEditMode,
  } = useOutletContext<DriveOutletContext>();

  const editable = isEditMode;
  /* ================= FETCH DRIVE CANDIDATES ================= */
  useEffect(() => {
    if (!driveId) return;

    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const res = await getDriveCandidates(driveId);
        setCandidates(res.data.data);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [driveId]);

  /* ================= OPEN ADD MODAL ================= */
  const openAddModal = async () => {
    setShowAdd(true);
    setSelectedCandidateIds([]);

    const res = await getAllCandidates();
    const all = res.data?.data ?? res.data;

    const existingIds = candidates.map((c) => c.candidateId);

    const filtered = all.filter(
      (c: any) => !existingIds.includes(c.candidateId)
    );

    setAvailableCandidates(filtered);
  };

  /* ================= TOGGLE CANDIDATE ================= */
  const toggleCandidate = (candidateId: number) => {
    setSelectedCandidateIds((prev) =>
      prev.includes(candidateId)
        ? prev.filter((id) => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  /* ================= ADD SELECTED ================= */
  const handleAddSelected = async () => {
    if (selectedCandidateIds.length === 0) return;

    try {
      await addDriveCandidates({
        driveId,
        candidateIds: selectedCandidateIds,
      });

      setShowAdd(false);
      setSelectedCandidateIds([]);

      const res = await getDriveCandidates(driveId);
      setCandidates(res.data.data);
    } catch (error) {
      console.error("Failed to add candidates", error);
    }
  };


  /* ================= REMOVE ================= */
  const openRemoveConfirm = (c: any) => {
    setRemoveTarget({
      candidateId: c.candidateId,
      candidateName: c.candidateName,
      candidateEmail: c.candidateEmail,
    });
    setShowRemove(true);
  };

  const confirmRemove = async () => {
    if (!removeTarget) return;

    await removeDriveCandidates({
      
        driveId,
        candidateIds: [removeTarget.candidateId],
      
    });

    setShowRemove(false);
    setRemoveTarget(null);

    const res = await getDriveCandidates(driveId);
    setCandidates(res.data.data);
  };

  if (loading) return <p>Loading Candidates...</p>;

  return (
    <div className="drive-member-card">
      {/* HEADER */}
      {editable && (
        <div className="member-header">
          <button className="btn add-btn" onClick={openAddModal}>
            + Add Candidate
          </button>
        </div>
      )}

      {/* TABLE */}
      <div className="member-table">
        <div className="table-head">
          <span>Name</span>
          <span>Email</span>
          <span>Action</span>
        </div>

        {candidates.map((c) => (
          <div key={c.candidateId} className="table-row">
            <span>{c.candidateName}</span>
            <span>{c.candidateEmail}</span>

            <div className="actions">
              <button
                className="icon-btn view"
                onClick={() => navigate(`viewcandidate/${c.candidateId}`)}
              >
                <i className="fa-solid fa-eye"></i>
              </button>

              {editable && (
                <button
                  className="icon-btn remove"
                  onClick={() => openRemoveConfirm(c)}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ADD MODAL */}
      {showAdd && (
        <div className="hr-modal-backdrop">
          <div className="hr-modal">
            <h4>Select Candidates</h4>

            <div className="hr-select-table">
              <div className="hr-select-head">
                <span></span>
                <span>Name</span>
                <span>Email</span>
                <span>Phone</span>
              </div>

              {availableCandidates.map((c) => (
                <div key={c.candidateId} className="hr-select-row">
                  <input
                    type="checkbox"
                    checked={selectedCandidateIds.includes(c.candidateId)}
                    onChange={() => toggleCandidate(c.candidateId)}
                  />
                  <span>{c.fullName}</span>
                  <span>{c.email}</span>
                  <span>{c.phone}</span>
                </div>
              ))}
            </div>

            <div className="modal-actions">
              <button
                className="btn primary"
                disabled={selectedCandidateIds.length === 0}
                onClick={handleAddSelected}
              >
                Add Selected
              </button>
              <button
                className="btn secondary"
                onClick={() => setShowAdd(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REMOVE CONFIRM */}
      {showRemove && removeTarget && (
        <div className="confirm-backdrop">
          <div className="confirm-modal">
            <h4>Remove Candidate</h4>

            <p>Are you sure you want to remove this candidate?</p>

            <div className="confirm-details">
              <div>
                <strong>Name:</strong> {removeTarget.candidateName}
              </div>
              <div>
                <strong>Email:</strong> {removeTarget.candidateEmail}
              </div>
            </div>

            <div className="confirm-actions">
              <button className="btn danger" onClick={confirmRemove}>
                Remove
              </button>
              <button
                className="btn secondary"
                onClick={() => setShowRemove(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="drive-member-card">
          <Outlet />
        </div>
    </div>
   
  );
};

export default DriveCandidates;
