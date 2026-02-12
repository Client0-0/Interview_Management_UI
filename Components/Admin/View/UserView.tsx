import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Styles/UserView.css";
import type { Users } from "../../../Models/user";

const UserView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = location.state as Users | undefined;
 
  // Safety check (direct URL hit)
  if (!user) {
    navigate("/admin/users");
    return null;
  }

  const onClose = () => {
    navigate(-1);
  };

  return (
    <div className="userview-overlay" onClick={onClose}>
      <div
        className="userview-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="userview-header">
          <h3>{user.roleName} Details</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Content */}
        <div className="userview-body">
          <div className="detail-row">
            <span className="label">Full Name</span>
            <span className="value">{user.fullName}</span>
          </div>

          <div className="detail-row">
            <span className="label">Email</span>
            <span className="value">{user.email}</span>
          </div>

          <div className="detail-row">
            <span className="label">Phone</span>
            <span className="value">{user.phone}</span>
          </div>

          <div className="detail-row">
            <span className="label">Role</span>
            <span className="value">{user.roleName}</span>
          </div>

          <div className="detail-row">
            <span className="label">Status</span>
            <span
              className={`status-pill ${
                user.isActive ? "active" : "inactive"
              }`}
            >
              {user.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="detail-row">
            <span className="label">Created Date</span>
            <span className="value">
              {new Date(user.createdDate).toLocaleString()}
            </span>
          </div>

          {user.updatedDate && (
            <div className="detail-row">
              <span className="label">Updated Date</span>
              <span className="value">
                {new Date(user.updatedDate).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="userview-footer">
          <button className="btn primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserView;
