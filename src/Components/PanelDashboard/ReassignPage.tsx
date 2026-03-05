 
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import type { Candidate } from "../../Models/Candidate";
import type { reassignpanel } from "../../Models/ReassignPanel";
import type { User } from "../../Models/user";
import * as ReassignService from "../../Services/ReassignService";
import { notifySuccess, notifyError } from "../../Utils/toastHelper";
import "../Styles/ReassignPage.css";

interface LocationState {
  candidate?: Candidate;
  driveId?: number;
  driveName?: string;
  candidateName?: string;
  Round?: number;
}

const ReassignPage: React.FC = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const routeState = location.state as LocationState | null;

  const numericCandidateId = Number(candidateId);

  const [candidate, setCandidate] = useState<Candidate | null>(
    routeState?.candidate ?? null
  );

  const [panelList, setPanelList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [reason, setReason] = useState("");
  const [selectedPanel, setSelectedPanel] = useState<string>("");
  const [notes, setNotes] = useState("");

  /* ================= LOAD CANDIDATE ================= */

  useEffect(() => {
    const loadCandidate = async () => {
      try {
        if (!routeState?.candidate && numericCandidateId > 0) {
          const data =
            await ReassignService.ReassignService.getCandidate(
              numericCandidateId
            );
          setCandidate(data);
        }
      } catch (err) {
        console.error("Failed to load candidate", err);
      } finally {
        setLoading(false);
      }
    };

    loadCandidate();
  }, [numericCandidateId, routeState]);

  /* ================= LOAD PANELS ================= */

  useEffect(() => {
    const loadPanels = async () => {
      try {
        const data =
          await ReassignService.ReassignService.getPanels();
        setPanelList(data);
      } catch (err) {
        console.error("Failed to load panels", err);
      }
    };

    if (candidate) loadPanels();
  }, [candidate]);

  /* ================= CONFIRM REASSIGN ================= */

  const handleConfirm = async () => {
    if (!reason) {
      notifyError("Please select a reason for reassignment.");
      return;
    }
    if (!selectedPanel) {
      notifyError("Please select a new panel member.");
      return;
    }

    const payload: reassignpanel = {
      candidateId: numericCandidateId,
      reason,
      AdditionNotes: notes,
      newPanelId: Number(selectedPanel),
    };

    try {
      const response =
        await ReassignService.ReassignService.postReassign(payload);

      if (response.ok) {
        notifySuccess("Panel reassigned successfully!");
        setTimeout(() => navigate(-1), 1200);
      } else {
        notifyError("Reassignment failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      notifyError("Something went wrong. Please try again later.");
    }
  };

  /* ================= LOADING / INVALID ================= */

  if (loading) return <p>Loading...</p>;
  if (!candidate) return <p>No candidate found</p>;

  /* ================= UI ================= */

  return (
    <div className="reassign-wrapper">


      <div className="reassign-card">
        {/* Candidate Information */}
        <div className="candidate-box">
          <h3 className="section-title">Candidate Information</h3>

          <div className="info-grid">
            <div>
              <label>Name</label>
              <p>{candidate.fullName}</p>

              <label>Email</label>
              <p>{candidate.email}</p>

              <label>Phone</label>
              <p>{candidate.phone}</p>

              <label>Current Panel</label>
              <p>{candidate.interviewerName ?? "Not Assigned"}</p>
            </div>

            <div>
              <label>Drive</label>
              <p>{routeState?.driveName ?? "-"}</p>

              <label>Round</label>
              <p>Round {routeState?.Round ?? "-"}</p>

              <label>Position</label>
              <p>{candidate.candidatePosition ?? "-"}</p>
            </div>
          </div>
        </div>

        {/* Reason Section */}
        <div className="section">
          <h3 className="section-title">Reason for Reassignment *</h3>

          <div className="radio-group">
            {[
              "Panel member on sudden leave",
              "Panel member in adhoc meeting",
              "Panel member on urgent call",
              "Other reason",
            ].map((r) => (
              <label className="radio-item" key={r}>
                <input
                  type="radio"
                  value={r}
                  checked={reason === r}
                  onChange={() => setReason(r)}
                />
                {r}
              </label>
            ))}
          </div>

          <div className="notes-section">
            <label>Additional Notes (Optional)</label>
            <textarea
              placeholder="Add any additional information..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Panel Selection */}
        <div className="section">
          <h3 className="section-title">Select New Panel *</h3>

          <div className="panel-grid">
            {panelList.map((panel) => {
              const isCurrent =
                panel.fullName === candidate.interviewerName;

              return (
                <div
                  key={panel.userId}
                  className={`panel-card 
                    ${selectedPanel === String(panel.userId)
                      ? "selected"
                      : ""
                    }
                    ${isCurrent ? "disabled" : ""}
                  `}
                  onClick={() =>
                    !isCurrent &&
                    setSelectedPanel(String(panel.userId))
                  }
                >
                  <div>
                    <p className="panel-name">
                      {panel.fullName}
                    </p>

                    {isCurrent && (
                      <span className="current-panel-tag">
                        Current Panel
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Buttons */}
        <div className="bottom-buttons">
          <button
            className="cancel-btn"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>

          <button
            className="confirm-btn"
            onClick={handleConfirm}
          >
            Confirm Reassignment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReassignPage;
