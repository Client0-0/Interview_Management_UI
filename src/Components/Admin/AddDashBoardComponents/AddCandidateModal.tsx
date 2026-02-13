/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo, useState } from "react";
import skillsData from "../TechStackFile/skills.json";
import "./Styles/Model.css";
import { CandidateService } from "../../../Services/User.Service";
import { notifyError, notifySuccess } from "../../../Utils/toastHelper";
import { useNavigate } from "react-router-dom";
import {
  validateEmail,
  validatePhone,
  validateRequired,
} from "../../../Utils/validation";

/* Flatten skills */
const ALL_SKILLS: string[] = Object.values(skillsData).flat();

const AddCandidateModal: React.FC = () => {
  const navigate = useNavigate();
  const onClose = () => {
    navigate("/admin/candidates");
  };
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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  /* Skill suggestions */
  const suggestions = useMemo(() => {
    if (!skillInput) return [];
    return ALL_SKILLS.filter(
      (s) =>
        s.toLowerCase().startsWith(skillInput.toLowerCase()) &&
        !selectedSkills.includes(s)
    ).slice(0, 8);
  }, [skillInput, selectedSkills]);

  const validateField = (name: string, value: string) => {
    let error: string | null = null;
    switch (name) {
      case "fullName":
        error = validateRequired(value, "Full Name");
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "phone":
        error = validatePhone(value);
        break;
      case "address":
        error = validateRequired(value, "Address");
        break;
      case "college":
        error = validateRequired(value, "College");
        break;
      case "experienceLevelName":
        error = validateRequired(value, "Experience Level");
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error || "" }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
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
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Validate fields
    ["fullName", "email", "phone", "address", "college", "experienceLevelName"].forEach(key => {
      let error = null;
      if (key === "email") error = validateEmail(form.email);
      else if (key === "phone") error = validatePhone(form.phone);
      else error = validateRequired(form[key as keyof typeof form], key);

      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched({
      fullName: true, email: true, phone: true, address: true, college: true, experienceLevelName: true
    });


    if (!isValid) return;

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
              value={form.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              className={errors.fullName ? "input-error" : ""}
            />
            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
          </label>

          <label>
            Email
            <input
              name="email"
              placeholder="candidate@example.com"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </label>

          <label>
            Phone Number
            <input
              name="phone"
              placeholder="+91 9876543210"
              value={form.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              className={errors.phone ? "input-error" : ""}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </label>

          <label>
            Address
            <input
              name="address"
              placeholder="Enter address"
              value={form.address}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              className={errors.address ? "input-error" : ""}
            />
            {errors.address && <span className="error-text">{errors.address}</span>}
          </label>

          <label>
            College
            <input
              name="college"
              placeholder="College name"
              value={form.college}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              className={errors.college ? "input-error" : ""}
            />
            {errors.college && <span className="error-text">{errors.college}</span>}
          </label>

          <label>
            Previous Company
            <input
              name="previousCompany"
              placeholder="Previous company"
              value={form.previousCompany}
              onChange={handleChange}
            />
            {/* Optional field, no error */}
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
              value={form.experienceLevelName}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              className={errors.experienceLevelName ? "input-error" : ""}
            >
              <option value="">Select</option>
              <option value="Fresher">Fresher</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Experienced">Experienced</option>
            </select>
            {errors.experienceLevelName && <span className="error-text">{errors.experienceLevelName}</span>}
          </label>

          <label>
            Resume URL
            <input
              name="resumeUrl"
              placeholder="Resume link"
              value={form.resumeUrl}
              onChange={handleChange}
            />
          </label>

          <label>
            LinkedIn URL
            <input
              name="linkedInUrl"
              placeholder="LinkedIn profile"
              value={form.linkedInUrl}
              onChange={handleChange}
            />
          </label>

          <label>
            GitHub URL
            <input
              name="gitHubUrl"
              placeholder="GitHub profile"
              value={form.gitHubUrl}
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
