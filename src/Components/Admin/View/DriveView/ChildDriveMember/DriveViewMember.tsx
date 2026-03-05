 
import React, { useEffect, useState } from "react";
import "./Styles/DriveViewMember.css";
import { getUserById } from "../../../../../Services/User.Service";
import type { Users } from "../../../../../Models/user";
import { useNavigate, useParams } from "react-router-dom";

const DriveViewMember: React.FC = () => {
  const { userId } = useParams<{ userId: string }>(); // 👈 always string
  const navigate = useNavigate();
  const [user, setUser] = useState<Users | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const id = Number(userId); // ✅ convert to number

    if (Number.isNaN(id)) return;

    const fetchUser = async () => {
      try {
        const res = await getUserById(id);
        setUser(res.data.data);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <div className="driveview-overlay">Loading...</div>;
  if (!user) return null;

  return (
    <div className="driveview-overlay" onClick={()=>navigate("..")}>
      <div
        className="driveview-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="driveview-header">
          <h3>User Details</h3>
          <button className="close-btn" onClick={()=>navigate("..")}>
            ×
          </button>
        </div>

        {/* BODY */}
        <div className="driveview-body">
          <div className="row">
            <span>Full Name</span>
            <span>{user.fullName}</span>
          </div>

          <div className="row">
            <span>Email</span>
            <span>{user.email}</span>
          </div>

          <div className="row">
            <span>Phone</span>
            <span>{user.phone}</span>
          </div>

          <div className="row">
            <span>Role</span>
            <span>{user.roleName}</span>
          </div>

          <div className="row">
            <span>Status</span>
            <span className={user.isActive ? "active" : "inactive"}>
              {user.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="row">
            <span>Created</span>
            <span>{new Date(user.createdDate).toLocaleString()}</span>
          </div>
        </div>

        {/* FOOTER */}
        <div className="driveview-footer">
          <button className="btn primary" onClick={()=>navigate("..")}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriveViewMember;
