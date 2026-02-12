import React from "react";
import "./Styles/HRDashboard.css";
import { useNavigate } from "react-router-dom";

const HRDashboard:React.FC = () => {
  const today=new Date();  
  const navigate=useNavigate();
  return (
   
    <div className="dashboard-wrapper">
       
      {/* DATE SECTION */}
      <div className="date-section">
        <i className="fa-regular fa-calendar"></i>
        <span>{today.toDateString()}</span>
      </div>

      {/* GRID CARDS */}
      <div className="cards-container">

        {/* Card 1 */}
        <div className="card">
          <div className="card-icon blue">
            <i className="fa-solid fa-users"></i>
          </div>
          <h3>Panel Available Today</h3>
          <p className="card-count">8</p>
          <p className="card-desc">Interviewers ready</p>
          <a href="#" className="card-link">View Panel Availability →</a>
        </div>

        {/* Card 2 */}
        <div className="card">
          <div className="card-icon green">
            <i className="fa-solid fa-user-check"></i>
          </div>
          <h3>Candidates Present Today</h3>
          <p className="card-count">12</p>
          <p className="card-desc">Scheduled for interviews</p>
          <a href="#" className="card-link green-link">View Details →</a>
        </div>

        {/* Card 3 */}
        <div className="card">
          <div className="card-icon purple">
            <i className="fa-solid fa-upload"></i>
          </div>
          <h3>Manage Candidates</h3>
          <p className="card-desc">Upload & track candidates</p>
          <button className="card-link purple-link" onClick={()=>navigate("candidatemanagement")}>Go to Management →</button>
        </div>

      </div>

    </div>
  );
};

export default HRDashboard;
