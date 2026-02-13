import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Candidate } from "../../Models/Candidate";
import { ReassignService } from "../../Services/ReassignService";
import { FaEnvelope, FaPhone, FaBriefcase } from "react-icons/fa";
import './Style/CandidateDetails.css';
const CandidateDetails: React.FC = () => {
  const { id } = useParams();
  
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);

  const candidateId = Number(id);

  useEffect(() => {
    const loadCandidate = async () => {
      try {
        const data = await ReassignService.getCandidate(candidateId);
        setCandidate(data);
      } catch (err) {
        console.error("Failed to load candidate", err);
      } finally {
        setLoading(false);
      }
    };

    if (candidateId > 0) loadCandidate();
  }, [candidateId]);

  if (loading)
    return <div className="dashboard-container">Loading candidate details...</div>;
  if (!candidate)
    return <div className="dashboard-container">Candidate not found.</div>;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Candidate Details Dashboard</h1>
        
        <button className="logout-btn">Logout</button><br/>
      </header>

      <div className="candidate-details-container">
        {/* Candidate Info Card */}
        <div className="candidate-card">
          <div className="candidate-header">
            <h2>{candidate.fullName}</h2>
            <p>{candidate.candidatePosition}</p>
            <span className="scheduled-time">Scheduled: {candidate.time}</span>
          </div>

          {/* Four Separate Gray Containers */}
          <p>Contact Information</p>

          <div className="info-grid">
            <div className="info-box">
              <FaEnvelope /> Email: {candidate.email}
            </div>
            <div className="info-box">
              <FaPhone /> Phone: {candidate.phone}
            </div>
            
         
          </div>
          
            <p>Professional Details</p>
          <div className="info-grid">
            <div className="info-box1">
              <FaBriefcase /> Position Applied: {candidate.candidatePosition}
            </div>
          </div>

          <div className="info-grid">
             <div className="info-box2">Experience: {candidate.Experience}</div>

          </div>

          {/* Skills */}
          <div className="section">
            <h3>Skills</h3>
            <div className="skills">
              {candidate.Skills?.map((skill: string) => (
                <span key={skill} className="skill">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Resume */}
          <div className="">
            <h3>Resume Summary</h3>
            <p>{candidate.resumeSummary}</p>
          </div>

          {/* Submit Button */}
          <button className="submit-button">Submit Interview Feedback</button>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetails;
