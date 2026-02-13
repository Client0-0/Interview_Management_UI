import React from "react";
import "./Styles/CandidateView.css";
import { useNavigate, useLocation } from "react-router-dom";
import type { CandidateDto } from "../../../Models/user";

const CandidateView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const candidate = location.state as CandidateDto | undefined;

  const onClose=()=>{
    navigate("/admin/candidates");
  }
  return (
    <div className="userview-overlay" onClick={onClose}>
      <div
        className="userview-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="userview-header">
          <h3>Candidate Details</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Body */}
        <div className="userview-body">
          <div className="detail-row">
            <span className="label">Full Name</span>
            <span className="value">{candidate?.fullName}</span>
          </div>

          <div className="detail-row">
            <span className="label">Email</span>
            <span className="value">{candidate?.email}</span>
          </div>

          <div className="detail-row">
            <span className="label">Phone</span>
            <span className="value">{candidate?.phone}</span>
          </div>

          <div className="detail-row">
            <span className="label">Address</span>
            <span className="value">{candidate?.address}</span>
          </div>

          <div className="detail-row">
            <span className="label">College</span>
            <span className="value">{candidate?.college}</span>
          </div>

          <div className="detail-row">
            <span className="label">Previous Company</span>
            <span className="value">
              {candidate?.previousCompany || "—"}
            </span>
          </div>

          <div className="detail-row">
            <span className="label">Experience Level</span>
            <span className="value">
              {candidate?.candidateExperienceLevel}
            </span>
          </div>

          <div className="detail-row">
            <span className="label">Tech Stack</span>
            <span className="value">
              {candidate?.techStack?.join(", ") || "—"}
            </span>
          </div>

          <div className="detail-row">
            <span className="label">Resume</span>
            <span className="value">
              <a
                href={candidate?.resumeUrl}
                target="_blank"
                rel="noreferrer"
              >
                View Resume
              </a>
            </span>
          </div>

          <div className="detail-row">
            <span className="label">LinkedIn</span>
            <span className="value">
              <a
                href={candidate?.linkedInUrl}
                target="_blank"
                rel="noreferrer"
              >
                Profile
              </a>
            </span>
          </div>

          <div className="detail-row">
            <span className="label">GitHub</span>
            <span className="value">
              <a
                href={candidate?.gitHubUrl}
                target="_blank"
                rel="noreferrer"
              >
                Repository
              </a>
            </span>
          </div>

          <div className="detail-row">
            <span className="label">Applied On</span>
            <span className="value">
              {candidate?.createdDate ? new Date(candidate?.createdDate).toLocaleString():"-"}
            </span>
          </div>
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

export default CandidateView;
