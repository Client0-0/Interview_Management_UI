import React from "react";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function Switch({ checked, onChange }: SwitchProps) {
  const switchStyle: React.CSSProperties = {
    width: "48px",
    height: "24px",
    borderRadius: "9999px",
    backgroundColor: checked ? "var(--primary)" : "#E2E8F0",
    position: "relative",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    display: "inline-flex",
    alignItems: "center",
    padding: "2px",
  };

  const thumbStyle: React.CSSProperties = {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    backgroundColor: "white",
    transform: checked ? "translateX(24px)" : "translateX(0)",
    transition: "transform 0.2s ease",
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
  };

  return (
    <div
      style={switchStyle}
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
    >
      <div style={thumbStyle} />
    </div>
  );
}
