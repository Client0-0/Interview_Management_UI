import React, { useEffect, useState } from "react";
import "./Styles/CandidateEdit.css";
import type {
  CandidateDto,
  UpdateCandidatePatchRequest,
} from "../../../Models/user";
import { notifyError, notifySuccess } from "../../../Utils/toastHelper";
import { updateCandidate } from "../../../Services/User.Service";

interface CandidateEditProps {
  candidate: CandidateDto;
  onClose: () => void;
  onSave: (payload: UpdateCandidatePatchRequest) => void;
}

const CandidateEdit: React.FC<CandidateEditProps> = ({
  candidate,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState<CandidateDto>(candidate);

  useEffect(() => {
    setForm(candidate);
  }, [candidate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTechStackChange = (value: string) => {
    const skills = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setForm((prev) => ({ ...prev, techStack: skills }));
  };

  const handleSave =async () => {
    const payload: UpdateCandidatePatchRequest = {
      candidateId: candidate.candidateId,
    };
    try{
    if (form.fullName !== candidate.fullName) payload.fullName = form.fullName;
    if (form.phone !== candidate.phone) payload.phone = form.phone;
    if (form.address !== candidate.address) payload.address = form.address;
    if (form.college !== candidate.college) payload.college = form.college;
    if (form.previousCompany !== candidate.previousCompany)
      payload.previousCompany = form.previousCompany;
    if (form.candidateExperienceLevel !== candidate.candidateExperienceLevel)
      payload.experienceLevelName = form.candidateExperienceLevel;
    if (JSON.stringify(form.techStack || []) !== JSON.stringify(candidate.techStack || []))
      payload.techStack = form.techStack;
    if (form.resumeUrl !== candidate.resumeUrl) payload.resumeUrl = form.resumeUrl;
    if (form.linkedInUrl !== candidate.linkedInUrl) payload.linkedInUrl = form.linkedInUrl;
    if (form.gitHubUrl !== candidate.gitHubUrl) payload.gitHubUrl = form.gitHubUrl;

    if (Object.keys(payload).length === 1) {
      notifyError("No changes detected");
      return;
    }

    await updateCandidate(payload);

      notifySuccess("User updated successfully");
      onSave(form);
      onClose();
  
    } catch (error) {
      notifyError("Failed to update user");
      console.error(error);
    }

  };

  return (
    <div className="modal-backdrop">
      <div className="modal large">
        <div className="modal-header">
          <h3>Edit Candidate</h3>
          <button className="close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-grid">
          <label>Full Name
            <input name="fullName" value={form.fullName || ""} onChange={handleChange}/>
          </label>
          <label>Email
            <input value={form.email || ""} disabled />
          </label>
          <label>Phone
            <input name="phone" value={form.phone || ""} onChange={handleChange}/>
          </label>
          <label>Address
            <input name="address" value={form.address || ""} onChange={handleChange}/>
          </label>
          <label>College
            <input name="college" value={form.college || ""} onChange={handleChange}/>
          </label>
          <label>Previous Company
            <input name="previousCompany" value={form.previousCompany || ""} onChange={handleChange}/>
          </label>
          <label>Experience Level
            <select name="candidateExperienceLevel" value={form.candidateExperienceLevel || ""} onChange={handleChange}>
              <option value="">Select</option>
              <option value="Fresher">Fresher</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Experienced">Experienced</option>
            </select>
          </label>
          <label>Tech Stack (comma separated)
            <input value={(form.techStack || []).join(", ")} onChange={(e)=>handleTechStackChange(e.target.value)} />
          </label>
          <label>Resume URL
            <input name="resumeUrl" value={form.resumeUrl || ""} onChange={handleChange}/>
          </label>
          <label>LinkedIn URL
            <input name="linkedInUrl" value={form.linkedInUrl || ""} onChange={handleChange}/>
          </label>
          <label>GitHub URL
            <input name="gitHubUrl" value={form.gitHubUrl || ""} onChange={handleChange}/>
          </label>
        </div>

        <div className="modal-actions">
          <button className="btn cancel" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default CandidateEdit;
