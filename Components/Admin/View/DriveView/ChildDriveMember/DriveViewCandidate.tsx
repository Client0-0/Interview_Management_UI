/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import "./Styles/DriveViewCandidate.css";
import { getCandidateById } from "../../../../../Services/User.Service";
import type { CandidateDto } from "../../../../../Models/user";
import { useNavigate, useParams } from "react-router-dom";



const DriveViewCandidate: React.FC = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const navigate = useNavigate();

  const id = Number(candidateId);
  const [candidate, setCandidate] = useState<CandidateDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchCandidate = async () => {
      try {
        setLoading(true);
        const res = await getCandidateById(id);
        setCandidate(res);
      } catch (error) {
        console.error("Failed to load candidate details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  if (loading) {
    return (
      <div className="candidate-overlay">
        <div className="candidate-modal">Loading...</div>
      </div>
    );
  }
  const handleClose = () => navigate(-1);
  if (!candidate) return null;

  return (
    <div className="candidate-overlay" onClick={handleClose}>
      <div
        className="candidate-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="candidate-header">
          <h3>Candidate Details</h3>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>

        {/* BODY */}
        <div className="candidate-body">
          <Detail label="Full Name" value={candidate.fullName} />
          <Detail label="Email" value={candidate.email} />
          <Detail label="Phone" value={candidate.phone} />
          <Detail label="Address" value={candidate.address} />
          <Detail label="College" value={candidate.college} />
          <Detail label="Experience Level" value={candidate.candidateExperienceLevel} />
          <Detail
            label="Tech Stack"
            value={candidate.techStack?.join(", ") || "—"}
          />
          <Detail
            label="Previous Company"
            value={candidate.previousCompany || "—"}
          />

          <DetailLink label="Resume" url={candidate.resumeUrl} />
          <DetailLink label="LinkedIn" url={candidate.linkedInUrl} />
          <DetailLink label="GitHub" url={candidate.gitHubUrl} />

          <Detail
            label="Applied On"
            value={new Date(candidate.createdDate).toLocaleString()}
          />
        </div>

        {/* FOOTER */}
        <div className="candidate-footer">
          <button className="btn primary" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriveViewCandidate;

/* ===== SMALL HELPERS ===== */

const Detail = ({ label, value }: { label: string; value: any }) => (
  <div className="detail-row">
    <span className="label">{label}</span>
    <span className="value">{value}</span>
  </div>
);

const DetailLink = ({ label, url }: { label: string; url?: string }) => (
  <div className="detail-row">
    <span className="label">{label}</span>
    <span className="value">
      {url ? (
        <a href={url} target="_blank" rel="noreferrer">
          View
        </a>
      ) : (
        "—"
      )}
    </span>
  </div>
);
