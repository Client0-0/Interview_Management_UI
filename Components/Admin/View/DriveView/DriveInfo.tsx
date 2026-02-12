/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useOutletContext } from "react-router-dom";
import "./Styles/DriveInfo.css";
import type { DriveOutletContext } from "./DriveView";

const DriveInfo: React.FC = () => {
  const {
    data,
    form,
    isEditMode,
    isViewMode,
    handleChange,
  } = useOutletContext<DriveOutletContext>();

  const driveData = isEditMode ? form : data;
  const readOnly = isViewMode;

  if (!driveData) return null;

  return (
    <div className="drive-info">
      <div className="form-grid">
        <div className="form-group">
          <label>Drive Name</label>
          <input
            name="driveName"
            value={driveData.driveName || ""}
            onChange={handleChange}
            disabled={readOnly}
          />
        </div>

        <div className="form-group">
          <label>Drive Date</label>
          <input
            type="date"
            name="driveDate"
            value={
              driveData.driveDate
                ? new Date(driveData.driveDate)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
            onChange={handleChange}
            disabled={readOnly}
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            name="driveStatus"
            value={driveData.driveStatus || ""}
            onChange={handleChange}
            disabled={readOnly}
          >
            <option value="">Select</option>
            <option value="InProposal">InProposal</option>
            <option value="Started">Started</option>
            <option value="Halted">Halted</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div className="form-group">
          <label>Technical Rounds</label>
          <input
            type="number"
            name="technicalRounds"
            value={driveData.technicalRounds ?? 0}
            onChange={handleChange}
            disabled={readOnly}
            min={0}
          />
        </div>

        <div className="form-group">
          <label>Created By</label>
          <input value={driveData.creatorName || "-"} disabled />
        </div>

        <div className="form-group">
          <label>Created Date</label>
          <input
            value={
              driveData.createdDate
                ? new Date(driveData.createdDate)
                    .toISOString()
                    .split("T")[0]
                : "-"
            }
            disabled
          />
        </div>
      </div>

      {readOnly && (
        <p className="view-note">
          🔒 This drive is in view mode. Editing is disabled.
        </p>
      )}
    </div>
  );
};

export default DriveInfo;
