/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  getDriveMembers,
  addDriveMember,
  removeDriveMember,
  getAllMentors,
} from "../../../../../Services/User.Service";
import "./Styles/DriveMembers.css";

import { Outlet ,useNavigate,useOutletContext } from "react-router-dom";


type DriveMemberContext = {
  driveId: number;
  editable: boolean;
}

interface RemoveTarget {
  memberId: number;
  name: string;
  email: string;
}

const DriveMentor: React.FC = () => {
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [showAdd, setShowAdd] = useState(false);
  const [availableMentors, setAvailableMentors] = useState<any[]>([]);
  const [selectedMentors, setSelectedMentors] = useState<number[]>([]);


  const [showRemove, setShowRemove] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<RemoveTarget | null>(null);

  const { driveId, editable } = useOutletContext<DriveMemberContext>();
  
  const navigate=useNavigate();

  /* ================= FETCH MENTORS ================= */
  useEffect(() => {
    if (!driveId) return;

    const fetchMentors = async () => {
      try {
        setLoading(true);
        const res = await getDriveMembers(driveId, "MENTOR");
        setMentors(res);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, [driveId]);

  /* ================= OPEN ADD MODAL ================= */
  const openAddModal = async () => {
    setShowAdd(true);

    const res = await getAllMentors();
    const allUsers = res.data.data ?? res.data;

    const existingIds = mentors.map((m) => m.userId);

    const filtered = allUsers.filter(
      (u: any) => !existingIds.includes(u.userId)
    );

    setAvailableMentors(filtered);
  };

  /* ================= TOGGLE MENTOR ================= */
  const toggleMentor = (userId: number) => {
    setSelectedMentors((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  /* ================= ADD SELECTED ================= */
  const handleAddSelected = async () => {
    for (const userId of selectedMentors) {
      await addDriveMember({
        driveId,
        memberId: userId,
        memberRole: "MENTOR",
      });
    }

    setShowAdd(false);
    setSelectedMentors([]);

    const res = await getDriveMembers(driveId, "MENTOR");
    setMentors(res);
  };

  /* ================= OPEN REMOVE CONFIRM ================= */
  const openRemoveConfirm = (mentor: any) => {
    setRemoveTarget({
      memberId: mentor.userId,
      name: mentor.userName,
      email: mentor.userEmail,
    });
    setShowRemove(true);
  };

  /* ================= CONFIRM REMOVE ================= */
  const confirmRemove = async () => {
    if (!removeTarget) return;

    await removeDriveMember({
      driveId,
      memberId: removeTarget.memberId,
    });

    setShowRemove(false);
    setRemoveTarget(null);

    const res = await getDriveMembers(driveId, "MENTOR");
    setMentors(res);
  };

  if (loading) return <p>Loading Mentors...</p>;

  return (
    <div className="drive-member-card">
      {editable && (
        <div className="member-header">
          <button className="btn add-btn" onClick={openAddModal}>
            + Add Mentor
          </button>
        </div>
      )}

      <div className="member-table">
        <div className="table-head">
          <span>Name</span>
          <span>Email</span>
          <span>Action</span>
        </div>

        {mentors.map((mentor) => (
          <div key={mentor.userId} className="table-row">
            <span>{mentor.userName}</span>
            <span>{mentor.userEmail}</span>

            <div className="actions">
              <button
                className="icon-btn view"
                onClick={() => navigate(`view/${mentor.userId}`)}
              >
                 <i className="fa-solid fa-eye"></i>
              </button>

              {editable && (
                <button
                  className="icon-btn remove"
                  onClick={() => openRemoveConfirm(mentor)}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ADD MENTOR MODAL */}
      {showAdd && (
        <div className="hr-modal-backdrop">
          <div className="hr-modal">
            <h4>Select Mentor</h4>

            <div className="hr-select-table">
              <div className="hr-select-head">
                <span></span>
                <span>Name</span>
                <span>Email</span>
                <span>Phone</span>
              </div>

              {availableMentors.map((m) => (
                <div key={m.userId} className="hr-select-row">
                  <input
                    type="checkbox"
                    checked={selectedMentors.includes(m.userId)}
                    onChange={() => toggleMentor(m.userId)}
                  />
                  <span>{m.fullName}</span>
                  <span>{m.email}</span>
                  <span>{m.phone}</span>
                </div>
              ))}
            </div>

            <div className="modal-actions">
              <button
                className="btn primary"
                disabled={selectedMentors.length === 0}
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
            <h4>Remove Mentor</h4>

            <p className="confirm-text">
              Are you sure you want to remove this mentor from the drive?
            </p>

            <div className="confirm-details">
              <div>
                <strong>Name:</strong> {removeTarget.name}
              </div>
              <div>
                <strong>Email:</strong> {removeTarget.email}
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

      <Outlet />
    </div>
  );
};

export default DriveMentor;
