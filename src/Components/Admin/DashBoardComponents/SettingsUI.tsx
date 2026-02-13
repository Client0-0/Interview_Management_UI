import { useState, type JSX } from "react";
import "./styles/SettingsUI.css";
import type { SettingsData } from "../../../Models/user";

/* ================= TYPES ================= */

interface SettingsUIProps {
  onBack: () => void;
  onSave: (data: SettingsData) => void;
}

/* ================= COMPONENT ================= */

export default function SettingsUI({ onBack, onSave }: SettingsUIProps): JSX.Element {
  const [toggles, setToggles] = useState<SettingsData>({
    allowPanelReassignment: true,
    requireMentorApproval: false,
    allowBulkUpload: true,
    autoAssignPanels: false,
    panelCanEditFeedback: false,
    candidateCanViewFeedback: false,
    emailNotifications: true,
    canEditSubmittedFeedback: true,
    requireApprovalForReassignment: false,
    canViewFeedback: true,

    showPhone: false,
    showEmail: true,
    showPrevCompany: true,
    showResume: true,
    showCollege: true,
    showAddress: false,
    showLinkedIn: true,
    showGithub: true,
  });

  // Use keyof SettingsData to make TypeScript happy
  function toggle(key: keyof SettingsData) {
    setToggles((s) => ({ ...s, [key]: !s[key] }));
  }

  return (
    <div className="settings-root">
      {/* HEADER */}
      <div className="settings-header">
        <h2>System Settings</h2>
        <button
          className="btn-close"
          onClick={onBack}
          aria-label="Close"
          type="button"
        >
          ✕
        </button>
      </div>

      <div className="container">
        {/* ROLE PERMISSIONS */}
        <section className="card">
          <div className="card-title">
            <div className="icon-circle1">🔒</div>
            <div>
              <h2>Role Permissions</h2>
              <p className="muted">
                Configure what each role can do in the system
              </p>
            </div>
          </div>

          <div className="section">
            <h4 className="section-title">Mentor / Coordinator</h4>

            <SettingRow
              title="Allow Panel Reassignment"
              desc="Mentors can reassign panels for sudden leaves or conflicts"
              value={toggles.allowPanelReassignment}
              onToggle={() => toggle("allowPanelReassignment")}
            />

            <SettingRow
              title="Can View Feedback"
              desc="Allow Mentor to view submitted feedback"
              value={toggles.canViewFeedback}
              onToggle={() => toggle("canViewFeedback")}
            />

            <SettingRow
              title="Require Mentor Approval"
              desc="All panel assignments must be approved"
              value={toggles.requireMentorApproval}
              onToggle={() => toggle("requireMentorApproval")}
            />
          </div>

          <div className="divider" />

          <div className="section">
            <h4 className="section-title">HR</h4>

            <SettingRow
              title="Allow Bulk Upload"
              desc="Upload candidates via Excel or CSV"
              value={toggles.allowBulkUpload}
              onToggle={() => toggle("allowBulkUpload")}
            />

            <SettingRow
              title="Auto Assign Panels"
              desc="Automatically assign panels based on availability"
              value={toggles.autoAssignPanels}
              onToggle={() => toggle("autoAssignPanels")}
            />

            <SettingRow
              title="Can Edit Submitted Feedback"
              desc="Allow editing of feedback after submission"
              value={toggles.canEditSubmittedFeedback}
              onToggle={() => toggle("canEditSubmittedFeedback")}
            />

            <SettingRow
              title="Require Approval for Reassignment"
              desc="Reassignments require approval"
              value={toggles.requireApprovalForReassignment}
              onToggle={() => toggle("requireApprovalForReassignment")}
            />
          </div>
        </section>

        {/* PANEL & CANDIDATE */}
        <section className="card narrow">
          <div className="section">
            <h4 className="section-title">Panel</h4>

            <SettingRow
              title="Edit Submitted Feedback"
              desc="Panels can edit feedback after submission"
              value={toggles.panelCanEditFeedback}
              onToggle={() => toggle("panelCanEditFeedback")}
            />

            <SettingRow
              title="Allow Panel Reassignment"
              desc="Mentors can reassign panels for sudden leaves or conflicts"
              value={toggles.allowPanelReassignment}
              onToggle={() => toggle("allowPanelReassignment")}
            />

            <SettingRow
              title="Require Approval for Reassignment"
              desc="Reassignments require approval"
              value={toggles.requireApprovalForReassignment}
              onToggle={() => toggle("requireApprovalForReassignment")}
            />
          </div>

          <div className="divider" />
        </section>

        {/* VISIBILITY */}
        <section className="card">
          <div className="section">
            <h4 className="card-sub">Panel Visibility</h4>
            <p className="muted">
              Control which candidate details panels can see
            </p>

            <div className="visibility-grid">
              <VisibilityRow
                label="Phone Number"
                desc="Show candidate phone"
                on={toggles.showPhone}
                onToggle={() => toggle("showPhone")}
                hidden
              />
              <VisibilityRow
                label="Email Address"
                desc="Show candidate email"
                on={toggles.showEmail}
                onToggle={() => toggle("showEmail")}
              />
              <VisibilityRow
                label="Previous Company"
                desc="Show previous employer"
                on={toggles.showPrevCompany}
                onToggle={() => toggle("showPrevCompany")}
              />
              <VisibilityRow
                label="Resume"
                desc="Allow resume download"
                on={toggles.showResume}
                onToggle={() => toggle("showResume")}
              />
              <VisibilityRow
                label="College"
                desc="Show education details"
                on={toggles.showCollege}
                onToggle={() => toggle("showCollege")}
              />
              <VisibilityRow
                label="Address"
                desc="Show residential address"
                on={toggles.showAddress}
                onToggle={() => toggle("showAddress")}
                hidden
              />
              <VisibilityRow
                label="LinkedIn"
                desc="Show LinkedIn profile"
                on={toggles.showLinkedIn}
                onToggle={() => toggle("showLinkedIn")}
              />
              <VisibilityRow
                label="GitHub"
                desc="Show GitHub profile"
                on={toggles.showGithub}
                onToggle={() => toggle("showGithub")}
              />
            </div>
          </div>
        </section>

        {/* NOTIFICATIONS */}
        <section className="card">
          <div className="section">
            <h4 className="card-sub">Notifications</h4>

            <SettingRow
              title="Send Email Notifications"
              desc="Send automated emails for interviews"
              value={toggles.emailNotifications}
              onToggle={() => toggle("emailNotifications")}
            />
          </div>
          
        </section>
        <div className="settings-footer">
          <button className="btn-primary" onClick={() => onSave(toggles)}>
            Save Settings/Next
          </button>
        </div>
      </div>

      {/* FOOTER */}
      
    </div>
  );
}

/* ================= HELPERS ================= */

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      className={`toggle ${on ? "on" : ""}`}
      onClick={onToggle}
      type="button"
      aria-pressed={on}
    >
      <span className="knob" />
    </button>
  );
}

function SettingRow({
  title,
  desc,
  value,
  onToggle,
}: {
  title: string;
  desc: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="row">
      <div className="row-left">
        <div className="row-title">{title}</div>
        <div className="muted">{desc}</div>
      </div>
      <div className="row-right">
        <Toggle on={value} onToggle={onToggle} />
      </div>
    </div>
  );
}

function VisibilityRow({
  label,
  desc,
  on,
  onToggle,
  hidden = false,
}: {
  label: string;
  desc: string;
  on: boolean;
  onToggle: () => void;
  hidden?: boolean;
}) {
  return (
    <div className="visibility-row">
      <div>
        <div className="row-title">
          {label} {hidden && <span className="hidden-icon">🚫</span>}
        </div>
        <div className="muted">{desc}</div>
      </div>
      <Toggle on={on} onToggle={onToggle} />
    </div>
  );
}
