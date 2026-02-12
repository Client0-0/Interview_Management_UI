/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import "./Styles/AddCandidate.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAllCandidates,
  addDriveCandidates,
  getDriveCandidates,
} from "../../../Services/User.Service";

const AddCandidate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  /* FETCH ALL CANDIDATES */
  useEffect(() => {
  if (!id) return;

  const fetch = async () => {
    try {
      setLoading(true);

      // 1️⃣ Get all candidates
      const allRes = await getAllCandidates();
      const allCandidates = allRes.data?.data ?? allRes.data ?? [];

      // 2️⃣ Get candidates already added to this drive
      const driveRes = await getDriveCandidates(Number(id));
      const driveCandidates = driveRes.data?.data ?? [];

      // 3️⃣ Extract already-added candidate IDs
      const existingIds = driveCandidates.map(
        (c: any) => c.candidateId
      );

      // 4️⃣ Filter out existing candidates
      const filtered = allCandidates.filter(
        (c: any) => !existingIds.includes(c.candidateId)
      );

      setCandidates(filtered);
    } catch (err) {
      console.error("Failed to fetch candidates", err);
    } finally {
      setLoading(false);
    }
  };

  fetch();
}, [id]);


  /* TOGGLE */
  const toggleCandidate = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /* ADD */
  const handleAddSelected = async () => {
    if (!id || selectedIds.length === 0) return;

    await addDriveCandidates({
      driveId: Number(id),
      candidateIds: selectedIds,
    });

    navigate(-1);
  };

  return (
    <div className="add-candidate-backdrop">
      <div className="add-candidate-modal">
        {/* HEADER */}
        <h4>Add Candidate</h4>

        {/* TABLE */}
        <div className="add-table">
          <div className="add-table-head">
            <span></span>
            <span>Username</span>
            <span>Email</span>
            <span>Phone</span>
          </div>

          {loading && <p className="loading">Loading candidates...</p>}

          {!loading &&
            candidates.map((c) => (
              <div className="add-table-row" key={c.candidateId}>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(c.candidateId)}
                  onChange={() => toggleCandidate(c.candidateId)}
                />
                <span>{c.fullName}</span>
                <span>{c.email}</span>
                <span>{c.phone}</span>
              </div>
            ))}
        </div>

        {/* FOOTER */}
        <div className="add-footer">
          <button className="btn secondary" onClick={() => navigate(-1)}>
            Cancel
          </button>

          <button
            className="btn primary"
            disabled={selectedIds.length === 0}
            onClick={handleAddSelected}
          >
            Add Selected
          </button>
        </div>
        {!loading && candidates.length === 0 && (
            <p className="empty-text">
                All candidates are already added to this drive
            </p>
            )}

      </div>
    </div>
  );
};

export default AddCandidate;
