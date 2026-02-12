import { useState} from "react";
import "./styles/FeedbackConfig.css";


import type { FeedbackData } from "../../../Models/user";

/* ================= TYPES ================= */

export type FieldType = "rating" | "textarea" | "select";

export interface FeedbackField {
  id: string;
  title: string;
  key: string;
  type: FieldType;
  required: boolean;
  enabled: boolean;
  value?: number;
  placeholder?: string;
  options?: string[];
}

interface FeedbackConfigProps {
  onBack: () => void;
  onSave: (data: FeedbackData) => void;
}

/* ================= COMPONENT ================= */

export default function FeedbackConfig({
  onBack,
  onSave,
}: FeedbackConfigProps) {
  const [fields, setFields] = useState<FeedbackField[]>([
    {
      id: "1",
      title: "Overall Rating",
      key: "overallRating",
      type: "rating",
      required: true,
      enabled: true,
      value: 0,
    },
    {
      id: "2",
      title: "Technical Skills Assessment",
      key: "technicalSkills",
      type: "textarea",
      required: true,
      enabled: true,
      placeholder: "Evaluate candidate's technical skills...",
    },
    {
      id: "3",
      title: "Communication Skills",
      key: "communication",
      type: "textarea",
      required: true,
      enabled: true,
      placeholder: "Assess communication ability...",
    },
    {
      id: "4",
      title: "Problem Solving Ability",
      key: "problemSolving",
      type: "textarea",
      required: true,
      enabled: true,
      placeholder: "Evaluate problem-solving approach...",
    },
    {
      id: "5",
      title: "Recommendation",
      key: "recommendation",
      type: "select",
      required: true,
      enabled: true,
      options: [
        "Strongly Recommend",
        "Recommend",
        "Neutral",
        "Do Not Recommend",
      ],
    },
    {
      id: "6",
      title: "Overall Feedback",
      key: "overallFeedback",
      type: "textarea",
      required: true,
      enabled: true,
      placeholder: "Additional comments...",
    },
  ]);

  /* ================= HELPERS ================= */

  const updateField = (id: string, changes: Partial<FeedbackField>) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...changes } : f))
    );
  };

  const updateRating = (id: string, value: number) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, value } : f))
    );
  };

  /* ================= SAVE ================= */

  const handleSave = () => {
    for (const f of fields) {
      if (f.required && f.enabled) {
        if (f.type === "rating" && (!f.value || f.value === 0)) {
          alert(`${f.title} is required`);
          return;
        }
      }
    }

    const data: FeedbackData = {
      overallRatingRequired: true,
      technicalSkillRequired: true,
      communicationRequired: true,
      problemSolvingRequired: true,
      recommendationRequired: true,
      overallFeedbackRequired: true,
    };

    onSave(data);
  };

  /* ================= RENDER ================= */

  return (
    <div className="feedback-page-overlay">
      <div className="config-root">
        {/* HEADER */}
        <div className="header-bar">
          <h2>Feedback Configuration</h2>
          <button className="btn-close" onClick={onBack}>
            ✕
          </button>
        </div>

        {/* FIELD CONFIGURATION */}
        <h3 className="section-title">Field Configuration</h3>

        <div className="field-list">
          {fields.map((f) => (
            <div className="field-row" key={f.id}>
              <div className="field-info">
                <strong>{f.title}</strong>
                <div className="muted small">({f.key})</div>
              </div>

              <span className="type-badge">{f.type}</span>

              <div className="toggle-group">
                <label className="toggle-row1">
                  <span>Enabled</span>
                  <input
                    type="checkbox"
                    checked={f.enabled}
                    onChange={() =>
                      updateField(f.id, {
                        enabled: !f.enabled,
                        required: f.enabled ? false : f.required,
                      })
                    }
                  />
                </label>

                <label className="toggle-row1">
                  <span>Required</span>
                  <input
                    type="checkbox"
                    checked={f.required}
                    disabled={!f.enabled}
                    onChange={() =>
                      updateField(f.id, { required: !f.required })
                    }
                  />
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* PREVIEW */}
        <div className="preview-box">
          <h3>Preview</h3>

          {fields.map((f) => (
            <div key={f.id} className="preview-field">
              <label>
                {f.title}
                {f.required && <span className="required">*</span>}
              </label>

              {f.type === "textarea" && (
                <textarea
                  placeholder={f.placeholder}
                  disabled={!f.enabled}
                />
              )}

              {f.type === "select" && (
                <select disabled={!f.enabled}>
                  <option value="">Select option</option>
                  {f.options?.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              )}

              {f.type === "rating" && (
                <StarRating
                  value={f.value ?? 0}
                  disabled={!f.enabled}
                  onChange={(v) => updateRating(f.id, v)}
                />
              )}
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="footer-actions">
          <button className="btn-primary" onClick={handleSave}>
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= STAR RATING ================= */

function StarRating({
  value,
  onChange,
  disabled,
  maxStars = 5,
}: {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  maxStars?: number;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className={`star-rating ${disabled ? "disabled" : ""}`}>
      {[...Array(maxStars)].map((_, i) => {
        const star = i + 1;
        return (
          <span
            key={star}
            className={`star ${star <= (hover || value) ? "filled" : ""}`}
            onClick={() => !disabled && onChange(star)}
            onMouseEnter={() => !disabled && setHover(star)}
            onMouseLeave={() => setHover(0)}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}
