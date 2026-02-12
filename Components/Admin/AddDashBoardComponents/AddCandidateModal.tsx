/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo, useState } from "react";
import skillsData from "../TechStackFile/skills.json";
import "./Styles/Model.css";
import { CandidateService } from "../../../Services/User.Service";
import { notifyError, notifySuccess } from "../../../Utils/toastHelper";
import { useNavigate } from "react-router-dom";



/* Flatten skills */
const ALL_SKILLS: string[] = Object.values(skillsData).flat();

const AddCandidateModal: React.FC= () => {
  const navigate=useNavigate();
  const onClose=()=>{
    navigate("/admin/candidates");
  }
  const [skillInput, setSkillInput] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    college: "",
    previousCompany: "",
    experienceLevelName: "",
    resumeUrl: "",
    linkedInUrl: "",
    gitHubUrl: "",
  });

  /* Skill suggestions */
  const suggestions = useMemo(() => {
    if (!skillInput) return [];
    return ALL_SKILLS.filter(
      (s) =>
        s.toLowerCase().startsWith(skillInput.toLowerCase()) &&
        !selectedSkills.includes(s)
    ).slice(0, 8);
  }, [skillInput, selectedSkills]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addSkill = (skill: string) => {
    setSelectedSkills([...selectedSkills, skill]);
    setSkillInput("");
    setShowSuggestions(false);
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  const handleSubmit = async () => {
    try {
      await CandidateService.addCandidate({
        ...form,
        techStack: selectedSkills,
      });

      notifySuccess("Candidate added successfully");
      onClose();
    } catch (err) {
      notifyError("Something went wrong while adding candidate");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal large">
        {/* HEADER */}
        <div className="modal-header">
          <h3>Add New Candidate</h3>
          <button className="close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* FORM */}
        <div className="modal-grid">
          <label>
            Full Name
            <input
              name="fullName"
              placeholder="Enter full name"
              onChange={handleChange}
            />
          </label>

          <label>
            Email
            <input
              name="email"
              placeholder="candidate@example.com"
              onChange={handleChange}
            />
          </label>

          <label>
            Phone Number
            <input
              name="phone"
              placeholder="+91 9876543210"
              onChange={handleChange}
            />
          </label>

          <label>
            Address
            <input
              name="address"
              placeholder="Enter address"
              onChange={handleChange}
            />
          </label>

          <label>
            College
            <input
              name="college"
              placeholder="College name"
              onChange={handleChange}
            />
          </label>

          <label>
            Previous Company
            <input
              name="previousCompany"
              placeholder="Previous company"
              onChange={handleChange}
            />
          </label>

          {/* TECH STACK */}
          <label className="full-width">
            Tech Stack / Skills
            <input
              value={skillInput}
              placeholder="Type skill (e.g., Java, SQL)..."
              onChange={(e) => {
                setSkillInput(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />

            {showSuggestions && suggestions.length > 0 && (
              <ul className="skill-suggestions">
                {suggestions.map((skill) => (
                  <li key={skill} onClick={() => addSkill(skill)}>
                    {skill}
                  </li>
                ))}
              </ul>
            )}

            {selectedSkills.length > 0 && (
              <div className="selected-skills">
                {selectedSkills.map((skill) => (
                  <span key={skill} className="skill-chip">
                    {skill}
                    <i onClick={() => removeSkill(skill)}>×</i>
                  </span>
                ))}
              </div>
            )}
          </label>

          <label>
            Experience Level
            <select
              name="experienceLevelName"
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Fresher">Fresher</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Experienced">Experienced</option>
            </select>
          </label>

          <label>
            Resume URL
            <input
              name="resumeUrl"
              placeholder="Resume link"
              onChange={handleChange}
            />
          </label>

          <label>
            LinkedIn URL
            <input
              name="linkedInUrl"
              placeholder="LinkedIn profile"
              onChange={handleChange}
            />
          </label>

          <label>
            GitHub URL
            <input
              name="gitHubUrl"
              placeholder="GitHub profile"
              onChange={handleChange}
            />
          </label>
        </div>

        {/* ACTIONS */}
        <div className="modal-actions">
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn primary" onClick={handleSubmit}>
            Add Candidate
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCandidateModal;
