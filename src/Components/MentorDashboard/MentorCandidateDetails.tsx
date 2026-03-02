import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import type { MentorCandidate } from "../../Models/user";
import "../Styles/PanelCandidateDetails.css"; // Reuse existing css
import {
    FaArrowLeft,
    FaEnvelope,
    FaPhone,
    FaBriefcase,
    FaGraduationCap,
    FaCode,
    FaUserCheck,
} from "react-icons/fa";

const MentorCandidateDetails: React.FC = () => {
    const { candidateId } = useParams<{ candidateId: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const passedCandidate = location.state?.candidate as MentorCandidate;

    // Derive candidate directly during render rather than via useEffect
    // This avoids cascading renders and fixes a React hooks lint error
    const candidate: MentorCandidate | null = passedCandidate || (candidateId ? {
        driveId: 701,
        driveName: "Campus Drive - JNTU",
        driveDate: "2025-12-06",
        candidateId: Number(candidateId),
        fullName: "Candidate " + candidateId,
        email: "candidate@example.com",
        phone: "8765432100",
        address: "Hyderabad",
        college: "JNTU",
        previousCompany: "Infosys",
        status: 1,
        roundType: "1",
        roundStatus: "Scheduled",
        roundResult: "",
        interviewerName: "Unassigned Panel",
        interviewerEmail: "",
        interviewerPhone: "",
        interviewerId: 0,
        candidateExperienceLevel: "2",
        techStack: ["React", "Node.js"],
        resumeUrl: "",
        linkedInUrl: "",
        gitHubUrl: "",
        userName: "",
        useremail: "",
        attendanceStatus: "Pending"
    } : null);


    if (!candidate) return <div className="panel-details-page">Candidate not found.</div>;

    const getRoundType = (roundType?: number | string | null) => {
        const parsed = typeof roundType === "string" ? parseInt(roundType, 10) : roundType;
        if (parsed === 1) return "Tech 1";
        if (parsed === 2) return "Tech 2";
        return "NA";
    };

    return (
        <div className="panel-details-page">
            <header className="panel-details-header">
                <div>
                    <h1>Candidate Profile</h1>
                    <p style={{ color: "var(--panel-text-sub)", margin: 0 }}>
                        Review candidate details and assignment status
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
                            <span>{candidate.college || "N/A"}</span>
                            <span className="status-badge info">
                                {getRoundType(candidate.roundType)}
                            </span>
                        </div>
                    </div>
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
                                <div className="info-value">{candidate.candidateExperienceLevel || "0"} years</div>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Previous Company</span>
                                <div className="info-value">{candidate.previousCompany || "N/A"}</div>
                            </div>
                        </div>
                    </section>

                    <section className="details-section">
                        <h3><FaCode /> Technical Skills</h3>
                        <div className="skills-wrapper">
                            {candidate.techStack && candidate.techStack.length > 0 ? (
                                candidate.techStack.map((skill, index) => (
                                    <span key={index} className="skill-tag">
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <span className="text-muted">No skills listed</span>
                            )}
                        </div>
                    </section>
                </div>

                {/* Right Column: Timeline/Metadata */}
                <div className="right-col">
                    <div className="side-column">
                        <h3>Interview Information</h3>
                        <div className="timeline">
                            <div className="timeline-item">
                                <div className="timeline-dot"></div>
                                <div className="timeline-content">
                                    <h4>Drive</h4>
                                    <span>{candidate.driveName || "N/A"}</span>
                                </div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-dot"></div>
                                <div className="timeline-content">
                                    <h4>Attendance</h4>
                                    <span className={`status-badge ${candidate.attendanceStatus?.toLowerCase() || 'pending'}`}>
                                        {candidate.attendanceStatus || "Pending"}
                                    </span>
                                </div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-dot"></div>
                                <div className="timeline-content">
                                    <h4>{getRoundType(candidate.roundType)} Interviewer</h4>
                                    <span style={{ color: "var(--panel-primary)", fontWeight: 600 }}>
                                        {candidate.interviewerName || "Not Assigned"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="details-footer">
                <button
                    className="action-btn primary large-btn"
                    onClick={() => navigate("/mentor/interviewfeedback")}
                >
                    <FaUserCheck /> Submit / View Feedback
                </button>
            </div>
        </div>
    );
};

export default MentorCandidateDetails;
