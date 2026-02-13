import React, { useEffect, useState, type ChangeEvent } from "react";
import "./styles/CreateDrive.css";
import "./styles/Model.css";
import {
  getAllHrs,
  getAllMentors,
  getAllPanels,
} from "../../../Services/User.Service";
import type { DriveFormData } from "../../../Models/user";
//import { useNavigate } from "react-router-dom";

/* ================= TYPES ================= */
interface User {
  userId: number;
  fullName: string;
}

/* ================= PROPS ================= */
interface Props {
  onNext: (data: DriveFormData) => void;
  onClose: () => void;
}

/* ================= COMPONENT ================= */
const CreateDriveModal: React.FC<Props> = ({ onNext, onClose }) => {
  const [form, setForm] = useState({
    driveName: "",
    driveDate: "",
    technicalRounds: 1,
    hrs: [] as User[],
    mentors: [] as User[],
    panels: [] as User[],
  });

  const [hrList, setHrList] = useState<User[]>([]);
  const [mentorList, setMentorList] = useState<User[]>([]);
  const [panelList, setPanelList] = useState<User[]>([]);

  const [showHr, setShowHr] = useState(false);
  const [showMentor, setShowMentor] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  //const navigate = useNavigate();

  /* ================= LOAD USERS ================= */
  useEffect(() => {
    const loadData = async () => {
      const hrRes = await getAllHrs();
      const mentorRes = await getAllMentors();
      const panelRes = await getAllPanels();

      setHrList(hrRes.data?.data ?? hrRes.data ?? []);
      setMentorList(mentorRes.data?.data ?? mentorRes.data ?? []);
      setPanelList(panelRes.data?.data ?? panelRes.data ?? []);
    };

    loadData();
  }, []);

  /* ================= HANDLERS ================= */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleUser = (type: "hrs" | "mentors" | "panels", user: User) => {
    setForm((prev) => ({
      ...prev,
      [type]: prev[type].some((u) => u.userId === user.userId)
        ? prev[type].filter((u) => u.userId !== user.userId)
        : [...prev[type], user],
    }));
  };

  const handleSubmit = () => {
    if (typeof onNext !== "function") {
      console.error("CreateDriveModal: onNext prop is missing");
      return;
    }

    const payload: DriveFormData = {
      driveName: form.driveName,
      driveDate: new Date(form.driveDate).toISOString(),
      technicalRounds: form.technicalRounds,
      hrs: form.hrs.map((h) => ({ userId: h.userId })),
      mentors: form.mentors.map((m) => ({ userId: m.userId })),
      panels: form.panels.map((p) => ({ userId: p.userId })),
    };

    console.log("CREATE DRIVE PAYLOAD:", payload);
    onNext(payload);
  };

  /* ================= UI ================= */
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal large"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Create New Drive</h3>
          {onClose && (
            <button className="close" onClick={onClose} aria-label="Close">
              ✕
            </button>
          )}
        </div>

        <div className="modal-grid two-col">
          <label>
            Drive Name <span className="required">*</span>
            <input
              name="driveName"
              value={form.driveName}
              onChange={handleChange}
            />
          </label>

          <label>
            Drive Date <span className="required">*</span>
            <input
              type="date"
              name="driveDate"
              value={form.driveDate}
              onChange={handleChange}
            />
          </label>

          <label>
            Technical Rounds
            <input
              type="number"
              min={1}
              name="technicalRounds"
              value={form.technicalRounds}
              onChange={handleChange}
            />
          </label>

          {/* HR */}
          <label>
            HR
            <div
              className="multi-select-input"
              onClick={() => setShowHr(!showHr)}
            >
              {form.hrs.length
                ? form.hrs.map((h) => h.fullName).join(", ")
                : "Select HR"}
            </div>
            {showHr && (
              <div className="multi-select-dropdown">
                {hrList.map((h) => (
                  <label key={h.userId} className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={form.hrs.some((x) => x.userId === h.userId)}
                      onChange={() => toggleUser("hrs", h)}
                    />
                    {h.fullName}
                  </label>
                ))}
              </div>
            )}
          </label>

          {/* Mentor */}
          <label>
            Mentor
            <div
              className="multi-select-input"
              onClick={() => setShowMentor(!showMentor)}
            >
              {form.mentors.length
                ? form.mentors.map((m) => m.fullName).join(", ")
                : "Select Mentor"}
            </div>
            {showMentor && (
              <div className="multi-select-dropdown">
                {mentorList.map((m) => (
                  <label key={m.userId} className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={form.mentors.some((x) => x.userId === m.userId)}
                      onChange={() => toggleUser("mentors", m)}
                    />
                    {m.fullName}
                  </label>
                ))}
              </div>
            )}
          </label>

          {/* Panel */}
          <label>
            Panel
            <div
              className="multi-select-input"
              onClick={() => setShowPanel(!showPanel)}
            >
              {form.panels.length
                ? form.panels.map((p) => p.fullName).join(", ")
                : "Select Panel"}
            </div>
            {showPanel && (
              <div className="multi-select-dropdown">
                {panelList.map((p) => (
                  <label key={p.userId} className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={form.panels.some((x) => x.userId === p.userId)}
                      onChange={() => toggleUser("panels", p)}
                    />
                    {p.fullName}
                  </label>
                ))}
              </div>
            )}
          </label>
        </div>

        <div className="modal-actions">
          {onClose && (
            <button className="btn" type="button" onClick={onClose}>
              Cancel
            </button>
          )}
          <button className="btn primary" type="button" onClick={handleSubmit}>
            Submit / Next
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateDriveModal;
