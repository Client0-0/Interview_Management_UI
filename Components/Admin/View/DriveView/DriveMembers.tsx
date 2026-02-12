/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  NavLink,
  Outlet,
  useOutletContext,
} from "react-router-dom";
import "./Styles/DriveMembers.css";
import type { DriveOutletContext } from "./DriveView";

const DriveMembers: React.FC = () => {
  const { driveId, isEditMode } =
    useOutletContext<DriveOutletContext>();

  return (
    <div className="drive-members-wrapper">
      {/* ================= ROLE TABS ================= */}
      <div className="role-switch">
        <NavLink
          to="drivehr"
          className={({ isActive }) =>
            `role-btn ${isActive ? "active" : ""}`
          }
        >
          HR
        </NavLink>

        <NavLink
          to="drivementor"
          className={({ isActive }) =>
            `role-btn ${isActive ? "active" : ""}`
          }
        >
          Mentor
        </NavLink>

        <NavLink
          to="drivepanel"
          className={({ isActive }) =>
            `role-btn ${isActive ? "active" : ""}`
          }
        >
          Panel
        </NavLink>
      </div>

      {/* ================= SEPARATOR ================= */}
      <hr className="role-separator" />

      {/* ================= CHILD ROUTE ================= */}
      <Outlet
        context={{
          driveId,
          editable: isEditMode,
        }}
      />
    </div>
  );
};

export default DriveMembers;
