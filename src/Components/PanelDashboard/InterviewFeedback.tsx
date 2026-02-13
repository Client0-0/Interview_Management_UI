import React, { useState } from "react";
import "../Styles/InterviewFeedback.css";
import { submitFeedback } from "../../Services/InterviewFeedbackService";

interface Feedback {
  overallRating: number;
  technicalSkills: string;
  communicationSkills: string;
  problemSolving: string;
  overallFeedback: string;
  recommendation: string;
}

const InterviewFeedback: React.FC = () => {
  const [feedback, setFeedback] = useState<Feedback>({
    overallRating: 0,
    technicalSkills: "",
    communicationSkills: "",
    problemSolving: "",
    overallFeedback: "",
    recommendation: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFeedback(prev => ({ ...prev, [name]: value }));
  };

  const handleRating = (rating: number) => {
    setFeedback(prev => ({ ...prev, overallRating: rating }));
  };

  const handleSubmit = async () => {
    try {
      await submitFeedback(feedback);
      alert("Feedback submitted successfully!");
    } catch (error) {
      alert("Failed to submit feedback.");
    }
  };

  return (
    <div>
      <header className="dashboard-header">
        <div>
          <h1>Interview Feedback Dashboard</h1>
          <p className="name">For Karan</p>
        </div>
        <button className="logout-btn">Logout</button>
      </header>
    <div className="feedback-container">
      

      <div className="rating-section">
        <label>Overall Rating</label>
        <div className="stars">
          {[1, 2, 3, 4, 5].map(star => (
            <span
              key={star}
              className={feedback.overallRating >= star ? "star selected" : "star"}
              onClick={() => handleRating(star)}
            >
              ★
            </span>
          ))}
          <span className="select-rating">Select rating</span>
        </div>
      </div>

      <div className="textarea-section">
        <label>Technical Skills</label>
        <textarea
          name="technicalSkills"
          value={feedback.technicalSkills}
          onChange={handleChange}
          placeholder="Evaluate the candidate's technical skills and knowledge..."
        />
      </div>

      <div className="textarea-section">
        <label>Communication Skills</label>
        <textarea
          name="communicationSkills"
          value={feedback.communicationSkills}
          onChange={handleChange}
          placeholder="Comment on the candidate's communication and presentation..."
        />
      </div>

      <div className="textarea-section">
        <label>Problem Solving Ability</label>
        <textarea
          name="problemSolving"
          value={feedback.problemSolving}
          onChange={handleChange}
          placeholder="Describe how the candidate approached problems..."
        />
      </div>

      <div className="textarea-section">
        <label>Overall Feedback</label>
        <textarea
          name="overallFeedback"
          value={feedback.overallFeedback}
          onChange={handleChange}
          placeholder="Provide your overall impression and feedback..."
        />
      </div>

      <div className="recommendation-section">
        <label>Recommendation</label>
        <div>
          {["Strong Hire", "Hire", "Maybe", "No Hire"].map(option => (
            <label key={option} className="radio-label">
              <input
                type="radio"
                name="recommendation"
                value={option}
                checked={feedback.recommendation === option}
                onChange={handleChange}
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      <div className="buttons">
        <button className="cancel-btn" onClick={() => alert("Cancelled")}>Cancel</button>
        <button className="submit-btn" onClick={handleSubmit}>Submit Feedback</button>
      </div>
    </div>
    </div>
  );
};

export default InterviewFeedback;
