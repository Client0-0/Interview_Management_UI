/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import "./Styles/DriveView.css";

import {
  getDriveById,
  updateDriveBasicDetails,
} from "../../../../Services/User.Service";
import { notifyError, notifySuccess } from "../../../../Utils/toastHelper";

export type Mode = "view" | "edit";

export type DriveOutletContext = {
  driveId: number;
  mode: Mode;
  isViewMode: boolean;
  isEditMode: boolean;
  data: any;
  form: any;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
};

const DriveView: React.FC<{ mode: Mode }> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const driveId = Number(id);
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";

  const basePath = `/admin/drives/${mode}/${driveId}`;

  const [data, setData] = useState<any>(null);
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isActive = (segment: string) =>
    location.pathname.endsWith(segment);

  /* ================= FETCH DRIVE ================= */
  useEffect(() => {
    if (!driveId) return;

    const fetchDrive = async () => {
      try {
        setLoading(true);
        const res = await getDriveById(driveId);
        const driveData = res?.data?.data ?? res?.data ?? res;

        setData(driveData);
        setForm(structuredClone(driveData));
      } catch (err) {
        notifyError("Failed to load drive details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDrive();
  }, [driveId]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev: any) => ({
      ...prev,
      [name]: name === "technicalRounds" ? Number(value) : value,
    }));
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!data || !form) return;

    const payload: any = { driveId };

    if (form.driveName !== data.driveName)
      payload.driveName = form.driveName;

    if (form.driveDate !== data.driveDate)
      payload.driveDate = form.driveDate;

    if (form.driveStatus !== data.driveStatus)
      payload.driveStatus = form.driveStatus;

    if (form.technicalRounds !== data.technicalRounds)
      payload.technicalRounds = form.technicalRounds;

    if (Object.keys(payload).length === 1) {
      notifyError("No changes detected");
      return;
    }

    try {
      setSaving(true);
      await updateDriveBasicDetails(payload);
      notifySuccess("Drive updated successfully");
      navigate("/admin/drives");
    } catch (err) {
      notifyError("Failed to update drive");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="drive-modal-backdrop">
        <div className="drive-modal">Loading drive details...</div>
      </div>
    );
  }

  if (!data || !form) return null;

  /* ================= UI ================= */
  return (
    <div className="drive-modal-backdrop">
      <div className="drive-modal">
        {/* HEADER */}
        <div className="drive-modal-header">
          <h3>
            {isViewMode ? "View Drive" : "Edit Drive"} — {data.driveName}
          </h3>
          <button
            className="icon-btn close"
            onClick={() => navigate("/admin/drives")}
          >
            ✕
          </button>
        </div>

        {/* TABS */}
        <div className="drive-tabs">
          <button
            className={`tab-btn ${isActive("driveinfo") ? "active" : ""}`}
            onClick={() => navigate(`${basePath}/driveinfo`)}
          >
            Drive Info
          </button>

          <button
            className={`tab-btn ${isActive("members") ? "active" : ""}`}
            onClick={() => navigate(`${basePath}/members`)}
          >
            Members
          </button>

          <button
            className={`tab-btn ${isActive("config") ? "active" : ""}`}
            onClick={() => navigate(`${basePath}/config`)}
          >
            Configuration
          </button>

          <button
            className={`tab-btn ${isActive("candidates") ? "active" : ""}`}
            onClick={() => navigate(`${basePath}/candidates`)}
          >
            Candidates
          </button>
        </div>

        {/* BODY */}
        <div className="drive-modal-body">
          <Outlet
            context={{
              driveId,
              mode,
              isViewMode,
              isEditMode,
              data,
              form,
              handleChange,
            }}
          />
        </div>

        {/* FOOTER */}
        <div className="drive-modal-footer">
          <button
            className="btn secondary"
            onClick={() => navigate("/admin/drives")}
          >
            Cancel
          </button>

          {isEditMode && (
            <button
              className="btn primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriveView;
