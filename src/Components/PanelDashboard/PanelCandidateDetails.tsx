import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Candidate } from "../../Models/Candidate";
import { ReassignService } from "../../Services/ReassignService";
import "../Styles/PanelCandidateDetails.css";
import {
    FaArrowLeft,
    FaEnvelope,
    FaPhone,
    FaBriefcase,
    FaGraduationCap,
    FaCode,
    FaFileAlt,
    FaUserCheck,
    FaExchangeAlt
} from "react-icons/fa";

const PanelCandidateDetails: React.FC = () => {
    const { candidateId } = useParams<{ candidateId: string }>();
    const navigate = useNavigate();

    const [candidate, setCandidate] = useState<Candidate | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCandidate = async () => {
            try {
                if (candidateId) {
                    const data = await ReassignService.getCandidate(Number(candidateId));
                    setCandidate(data);
                }
            } catch (err) {
                console.error("Failed to load candidate", err);
            } finally {
                setLoading(false);
            }
        };

        loadCandidate();
    }, [candidateId]);

    if (loading) return <div className="panel-details-page">Loading details...</div>;
    if (!candidate) return <div className="panel-details-page">Candidate not found.</div>;

    return (
        <div className="panel-details-page">
            <header className="panel-details-header">
                <div>
                    <h1>Candidate Profile</h1>
                    <p style={{ color: "var(--panel-text-sub)", margin: 0 }}>
                        Review candidate details before interview
                    </p>
                </div>
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Back
                </button>
            </header>

            <div className="panel-details-card">
                {/* Hero Section */}
                <div className="details-hero">
                    <div className="candidate-identity">
                        <h2>{candidate.fullName}</h2>
                        <div className="candidate-role">
                            <FaBriefcase />
                            <span>{candidate.candidatePosition}</span>
                            <span className="status-badge info">
                                Round {candidate.interviewRound ?? 1}
                            </span>
                        </div>
                    </div>

                    <div className="hero-actions">
                        <button
                            className="action-btn secondary"
                            onClick={() => navigate(`/panel/reassign/${candidateId}`)}
                        >
                            <FaExchangeAlt /> Reassign
                        </button>
                        <button
                            className="action-btn primary"
                            onClick={() => navigate("/panel/interviewfeedback", { state: { candidate } })}
                        >
                            <FaUserCheck /> Submit Feedback
                        </button>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="details-content">
                    {/* Left Column: Info */}
                    <div className="left-col">
                        <section className="details-section">
                            <h3><FaEnvelope /> Contact Information</h3>
                            <div className="info-row">
                                <div className="info-item">
                                    <span className="info-label">Email Address</span>
                                    <div className="info-value">{candidate.email}</div>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Phone Number</span>
                                    <div className="info-value"><FaPhone /> {candidate.phone}</div>
                                </div>
                            </div>
                        </section>

                        <section className="details-section">
                            <h3><FaGraduationCap /> Professional Details</h3>
                            <div className="info-row">
                                <div className="info-item">
                                    <span className="info-label">Experience</span>
                                    <div className="info-value">{candidate.Experience}</div>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Current Role</span>
                                    <div className="info-value">{candidate.candidatePosition}</div>
                                </div>
                            </div>
                        </section>

                        <section className="details-section">
                            <h3><FaCode /> Technical Skills</h3>
                            <div className="skills-wrapper">
                                {candidate.Skills?.map((skill, index) => (
                                    <span key={index} className="skill-tag">
                                        {skill}
                                    </span>
                                )) || <span className="text-muted">No skills listed</span>}
                            </div>
                        </section>

                        <section className="details-section">
                            <h3><FaFileAlt /> Resume Summary</h3>
                            <div className="resume-box">
                                <p className="resume-summary">
                                    {candidate.resumeSummary || "No resume summary available for this candidate."}
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Timeline/Metadata */}
                    <div className="right-col">
                        <div className="side-column">
                            <h3>Interview Timeline</h3>
                            <div className="timeline">
                                <div className="timeline-item">
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-content">
                                        <h4>Application Received</h4>
                                        <span>{new Date().toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="timeline-item">
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-content">
                                        <h4>Screening Round</h4>
                                        <span>Passed</span>
                                    </div>
                                </div>
                                <div className="timeline-item">
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-content">
                                        <h4>Technical Round {candidate.interviewRound}</h4>
                                        <span style={{ color: "var(--panel-primary)", fontWeight: 600 }}>Scheduled (Today)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PanelCandidateDetails;
