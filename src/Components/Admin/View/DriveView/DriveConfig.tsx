/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getDriveConfiguration } from "../../../../Services/User.Service";
import "./Styles/DriveConfig.css";
import type { DriveOutletContext } from "./DriveView";

/* ================= TOGGLE ROW ================= */
interface ToggleRowProps {
  label: string;
  value: boolean;
  editable: boolean;
  onChange?: (val: boolean) => void;
}

const ToggleRow: React.FC<ToggleRowProps> = ({
  label,
  value,
  editable,
  onChange,
}) => {
  return (
    <div className="config-row">
      <span className="label">{label}</span>

      {editable ? (
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange?.(e.target.checked)}
        />
      ) : (
        <span className={`pill ${value ? "yes" : "no"}`}>
          {value ? "Enabled" : "Disabled"}
        </span>
      )}
    </div>
  );
};

/* ================= COMPONENT ================= */
const DriveConfig: React.FC = () => {
  const { driveId, isEditMode } =
    useOutletContext<DriveOutletContext>();

  const [form, setForm] = useState<any | null>(null);

  /* ================= FETCH CONFIG ================= */
  useEffect(() => {
    if (!driveId) return;

    let mounted = true;

    (async () => {
      try {
        const res = await getDriveConfiguration(driveId);
        if (mounted) {
          setForm(structuredClone(res.data));
        }
      } catch (error) {
        console.error("Failed to fetch configuration", error);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [driveId]);

  /* ================= UPDATE HANDLER ================= */
  const updateConfig = (
    section: string,
    key: string,
    value: boolean
  ) => {
    setForm((prev: any) => ({
      ...prev,
      [section]: {
        ...prev?.[section],
        [key]: value,
      },
    }));
  };

  if (!form) {
    return <p className="empty-text">Loading configuration...</p>;
  }

  const {
    hrConfiguration = {},
    panelConfiguration = {},
    mentorConfiguration = {},
    panelVisibilitySettings = {},
    notificationSettings = {},
    feedbackConfiguration = {},
  } = form;

  return (
    <div className="drive-config">
      {/* ================= HR CONFIG ================= */}
      <section className="config-section">
        <h4>HR Configuration</h4>

        <ToggleRow
          label="Allow Bulk Upload"
          value={hrConfiguration.allowBulkUpload ?? false}
          editable={isEditMode}
          onChange={(v) =>
            updateConfig("hrConfiguration", "allowBulkUpload", v)
          }
        />

        <ToggleRow
          label="Edit Submitted Feedback"
          value={hrConfiguration.canEditSubmittedFeedback ?? false}
          editable={isEditMode}
          onChange={(v) =>
            updateConfig(
              "hrConfiguration",
              "canEditSubmittedFeedback",
              v
            )
          }
        />

        <ToggleRow
          label="Allow Panel Reassign"
          value={hrConfiguration.allowPanelReassign ?? false}
          editable={isEditMode}
          onChange={(v) =>
            updateConfig(
              "hrConfiguration",
              "allowPanelReassign",
              v
            )
          }
        />

        <ToggleRow
          label="Approval for Reassignment"
          value={
            hrConfiguration.requireApprovalForReassignment ?? false
          }
          editable={isEditMode}
          onChange={(v) =>
            updateConfig(
              "hrConfiguration",
              "requireApprovalForReassignment",
              v
            )
          }
        />
      </section>

      {/* ================= PANEL CONFIG ================= */}
      <section className="config-section">
        <h4>Panel Configuration</h4>

        <ToggleRow
          label="Edit Submitted Feedback"
          value={panelConfiguration.canEditSubmittedFeedback ?? false}
          editable={isEditMode}
          onChange={(v) =>
            updateConfig(
              "panelConfiguration",
              "canEditSubmittedFeedback",
              v
            )
          }
        />

        <ToggleRow
          label="Allow Panel Reassign"
          value={panelConfiguration.allowPanelReassign ?? false}
          editable={isEditMode}
          onChange={(v) =>
            updateConfig(
              "panelConfiguration",
              "allowPanelReassign",
              v
            )
          }
        />

        <ToggleRow
          label="Approval for Reassignment"
          value={
            panelConfiguration.requireApprovalForReassignment ??
            false
          }
          editable={isEditMode}
          onChange={(v) =>
            updateConfig(
              "panelConfiguration",
              "requireApprovalForReassignment",
              v
            )
          }
        />
      </section>

      {/* ================= MENTOR CONFIG ================= */}
      <section className="config-section">
        <h4>Mentor Configuration</h4>

        <ToggleRow
          label="Can View Feedback"
          value={mentorConfiguration.canViewFeedback ?? false}
          editable={isEditMode}
          onChange={(v) =>
            updateConfig(
              "mentorConfiguration",
              "canViewFeedback",
              v
            )
          }
        />

        <ToggleRow
          label="Allow Panel Reassign"
          value={mentorConfiguration.allowPanelReassign ?? false}
          editable={isEditMode}
          onChange={(v) =>
            updateConfig(
              "mentorConfiguration",
              "allowPanelReassign",
              v
            )
          }
        />

        <ToggleRow
          label="Approval for Reassignment"
          value={
            mentorConfiguration.requireApprovalForReassignment ??
            false
          }
          editable={isEditMode}
          onChange={(v) =>
            updateConfig(
              "mentorConfiguration",
              "requireApprovalForReassignment",
              v
            )
          }
        />
      </section>

      {/* ================= PANEL VISIBILITY ================= */}
      <section className="config-section">
        <h4>Panel Visibility Settings</h4>

        {Object.entries(panelVisibilitySettings).map(
          ([key, value]) => (
            <ToggleRow
              key={key}
              label={key.replace(/([A-Z])/g, " $1")}
              value={Boolean(value)}
              editable={isEditMode}
              onChange={(v) =>
                updateConfig("panelVisibilitySettings", key, v)
              }
            />
          )
        )}
      </section>

      {/* ================= NOTIFICATION ================= */}
      <section className="config-section">
        <h4>Notification Settings</h4>

        <ToggleRow
          label="Email Notifications"
          value={
            notificationSettings.emailNotificationEnabled ?? false
          }
          editable={isEditMode}
          onChange={(v) =>
            updateConfig(
              "notificationSettings",
              "emailNotificationEnabled",
              v
            )
          }
        />
      </section>

      {/* ================= FEEDBACK CONFIG ================= */}
      <section className="config-section">
        <h4>Feedback Configuration</h4>

        {Object.entries(feedbackConfiguration).map(
          ([key, value]) => (
            <ToggleRow
              key={key}
              label={key.replace(/([A-Z])/g, " $1")}
              value={Boolean(value)}
              editable={isEditMode}
              onChange={(v) =>
                updateConfig("feedbackConfiguration", key, v)
              }
            />
          )
        )}
      </section>
    </div>
  );
};

export default DriveConfig;
