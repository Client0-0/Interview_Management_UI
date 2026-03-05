/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  getDriveMembers,
  addDriveMember,
  removeDriveMember,
  getAllHrs,
} from "../../../../../Services/User.Service";
import "./Styles/DriveMembers.css";
//import DriveViewMember from "./DriveViewMember";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";

type DriveMemberContext = {
  driveId: number;
  editable: boolean;
};

interface RemoveTarget {
  memberId: number;
  name: string;
  email: string;
}

const DriveHR: React.FC = () => {
  const { driveId, editable } = useOutletContext<DriveMemberContext>();
  const navigate = useNavigate();
  const [hrs, setHrs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [availableHRs, setAvailableHRs] = useState<any[]>([]);
  const [selectedHRs, setSelectedHRs] = useState<number[]>([]);


  const [showRemove, setShowRemove] = useState<boolean>(false);
  const [removeTarget, setRemoveTarget] = useState<RemoveTarget | null>(null);

  /* ================= FETCH HR MEMBERS ================= */
  const fetchHRs = async () => {
    if (!driveId) return;

    try {
      setLoading(true);
      const res = await getDriveMembers(driveId, "HR");
      const data = res?.data?.data ?? res?.data ?? res;
      setHrs(data || []);
    } catch (err) {
      console.error("Failed to fetch HR members", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHRs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driveId]);

  /* ================= OPEN ADD MODAL ================= */
  const openAddModal = async () => {
    setShowAdd(true);
    setSelectedHRs([]);

    try {
      const res = await getAllHrs();
      const allUsers = res?.data?.data ?? res?.data ?? [];

      const existingUserIds = hrs.map((h) => h.userId);

      const filtered = allUsers.filter(
        (u: any) => !existingUserIds.includes(u.userId)
      );

      setAvailableHRs(filtered);
    } catch (err) {
      console.error("Failed to fetch HR list", err);
    }
  };

  /* ================= TOGGLE HR ================= */
  const toggleHR = (userId: number) => {
    setSelectedHRs((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  /* ================= ADD SELECTED ================= */
  const handleAddSelected = async () => {
    try {
      for (const userId of selectedHRs) {
        await addDriveMember({
          driveId,
          memberId: userId,
          memberRole: "HR",
        });
      }
      setShowAdd(false);
      setSelectedHRs([]);
      fetchHRs();
    } catch (err) {
      console.error("Failed to add HR", err);
    }
  };

  /* ================= OPEN REMOVE CONFIRM ================= */
  const openRemoveConfirm = (hr: any) => {
    setRemoveTarget({
      memberId: hr.userId,
      name: hr.userName,
      email: hr.userEmail,
    });
    setShowRemove(true);
  };

  /* ================= CONFIRM REMOVE ================= */
  const confirmRemove = async () => {
    if (!removeTarget) return;

    try {
      await removeDriveMember({
        driveId,
        memberId: removeTarget.memberId,
      });
      setShowRemove(false);
      setRemoveTarget(null);
      fetchHRs();
    } catch (err) {
      console.error("Failed to remove HR", err);
    }
  };

  if (loading) return <p className="empty-text">Loading HRs...</p>;

  return (
    <div className="drive-member-card">
      {/* HEADER */}
      {editable && (
        <div className="member-header">
          <button className="btn add-btn" onClick={openAddModal}>
            + Add HR
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

        {hrs.length === 0 && (
          <p className="empty-text">No HRs assigned</p>
        )}

        {hrs.map((hr) => (
          <div key={hr.userId} className="table-row">
            <span>{hr.userName}</span>
            <span>{hr.userEmail}</span>

            <div className="actions">
              <button
                className="icon-btn view"
                onClick={() => navigate(`view/${hr.userId}`)}
              >
                <i className="fa-solid fa-eye"></i>
              </button>

              {editable && (
                <button
                  className="icon-btn remove"
                  onClick={() => openRemoveConfirm(hr)}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ADD HR MODAL */}
      {showAdd && (
        <div className="hr-modal-backdrop">
          <div className="hr-modal">
            <h4>Select HR</h4>

            <div className="hr-select-table">
              <div className="hr-select-head">
                <span></span>
                <span>Name</span>
                <span>Email</span>
                <span>Phone</span>
              </div>

              {availableHRs.map((hr) => (
                <div key={hr.userId} className="hr-select-row">
                  <input
                    type="checkbox"
                    checked={selectedHRs.includes(hr.userId)}
                    onChange={() => toggleHR(hr.userId)}
                  />
                  <span>{hr.fullName}</span>
                  <span>{hr.email}</span>
                  <span>{hr.phone}</span>
                </div>
              ))}
            </div>

            <div className="modal-actions">
              <button
                className="btn primary"
                disabled={selectedHRs.length === 0}
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

      {/* REMOVE CONFIRM MODAL */}
      {showRemove && removeTarget && (
        <div className="confirm-backdrop">
          <div className="confirm-modal">
            <h4>Remove HR</h4>

            <p className="confirm-text">
              Are you sure you want to remove this HR from the drive?
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

      {/* VIEW HR */}
      <div className="drive-members-wrapper">
        {/* role tabs etc */}
        <Outlet />
      </div>

    </div>
  );
};

export default DriveHR;
