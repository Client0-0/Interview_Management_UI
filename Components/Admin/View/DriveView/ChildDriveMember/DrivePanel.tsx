/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  getDriveMembers,
  addDriveMember,
  removeDriveMember,
  getAllPanels,
} from "../../../../../Services/User.Service";
import "./Styles/DriveMembers.css";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";

type DriveMemberContext= {
  driveId: number;
  editable: boolean;
}

interface RemoveTarget {
  memberId: number;
  name: string;
  email: string;
}

const DrivePanel: React.FC = () => {
  const [panels, setPanels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [showAdd, setShowAdd] = useState(false);
  const [availablePanels, setAvailablePanels] = useState<any[]>([]);
  const [selectedPanels, setSelectedPanels] = useState<number[]>([]);


  const [showRemove, setShowRemove] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<RemoveTarget | null>(null);

  const { driveId, editable } = useOutletContext<DriveMemberContext>();
  const navigate= useNavigate();
  /* ================= FETCH PANEL MEMBERS ================= */
  useEffect(() => {
    if (!driveId) return;

    const fetchPanels = async () => {
      try {
        setLoading(true);
        const res = await getDriveMembers(driveId, "PANEL");
        setPanels(res);
      } finally {
        setLoading(false);
      }
    };

    fetchPanels();
  }, [driveId]);

  /* ================= OPEN ADD MODAL ================= */
  const openAddModal = async () => {
    setShowAdd(true);

    const res = await getAllPanels();
    const allUsers = res.data.data ?? res.data;

    const existingIds = panels.map((p) => p.userId);

    const filtered = allUsers.filter(
      (u: any) => !existingIds.includes(u.userId)
    );

    setAvailablePanels(filtered);
  };

  /* ================= TOGGLE PANEL ================= */
  const togglePanel = (userId: number) => {
    setSelectedPanels((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  /* ================= ADD SELECTED ================= */
  const handleAddSelected = async () => {
    for (const userId of selectedPanels) {
      await addDriveMember({
        driveId,
        memberId: userId,
        memberRole: "PANEL",
      });
    }

    setShowAdd(false);
    setSelectedPanels([]);

    const res = await getDriveMembers(driveId, "PANEL");
    setPanels(res);
  };

  /* ================= OPEN REMOVE CONFIRM ================= */
  const openRemoveConfirm = (panel: any) => {
    setRemoveTarget({
      memberId: panel.userId,
      name: panel.userName,
      email: panel.userEmail,
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

    const res = await getDriveMembers(driveId, "PANEL");
    setPanels(res);
  };

  if (loading) return <p>Loading Panel Members...</p>;

  return (
    <div className="drive-member-card">
      {/* HEADER */}
      {editable && (
        <div className="member-header">
          <button className="btn add-btn" onClick={openAddModal}>
            + Add Panel
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

        {panels.map((panel) => (
          <div key={panel.userId} className="table-row">
            <span>{panel.userName}</span>
            <span>{panel.userEmail}</span>

            <div className="actions">
              <button
                className="icon-btn view"
                onClick={() => navigate(`view/${panel.userId}`)}
              >
                 <i className="fa-solid fa-eye"></i>
              </button>

              {editable && (
                <button
                  className="icon-btn remove"
                  onClick={() => openRemoveConfirm(panel)}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ADD PANEL MODAL */}
      {showAdd && (
        <div className="hr-modal-backdrop">
          <div className="hr-modal">
            <h4>Select Panel</h4>

            <div className="hr-select-table">
              <div className="hr-select-head">
                <span></span>
                <span>Name</span>
                <span>Email</span>
                <span>Phone</span>
              </div>

              {availablePanels.length === 0 && (
                <p className="empty-text">No panels available</p>
              )}

              {availablePanels.map((p) => (
                <div key={p.userId} className="hr-select-row">
                  <input
                    type="checkbox"
                    checked={selectedPanels.includes(p.userId)}
                    onChange={() => togglePanel(p.userId)}
                  />
                  <span>{p.fullName}</span>
                  <span>{p.email}</span>
                  <span>{p.phone}</span>
                </div>
              ))}
            </div>

            <div className="modal-actions">
              <button
                className="btn primary"
                disabled={selectedPanels.length === 0}
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
            <h4>Remove Panel</h4>

            <p className="confirm-text">
              Are you sure you want to remove this panel member from the drive?
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

      {/* VIEW PANEL MEMBER */}
      <Outlet />
    </div>
  );
};

export default DrivePanel;
