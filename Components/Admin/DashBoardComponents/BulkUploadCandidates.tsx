import React, { useRef } from "react";
import "./Styles/BulkUploadCandidates.css";

interface Props {
  onBack: () => void;
}

const BulkUploadCandidates: React.FC<Props> = ({ onBack }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      console.log("Selected file:", e.target.files[0]);
    }
  };

  return (
    <div className="bulk-upload-container">
      <header className="bulk-upload-header">
        <button className="back-button" onClick={onBack}>
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>

        <div className="logout">
          <i className="fa-solid fa-right-from-bracket"></i> Logout
        </div>
      </header>

      <h1 className="bulk-upload-title">Bulk Upload Candidates</h1>
      <p className="bulk-upload-email">hr@gmail.com</p>

      <div className="upload-instructions">
        <ul>
          <li>Download the Excel template</li>
          <li>Fill candidate details</li>
          <li>Required columns: Name, Email, Phone, Skills</li>
          <li>Upload completed file</li>
        </ul>
      </div>

      <button className="download-button">
        <i className="fa-solid fa-download"></i> Download Excel Template
      </button>

      <div className="upload-area">
        <i className="fa-solid fa-cloud-arrow-up upload-icon"></i>
        <span>Drag and drop your Excel file here</span>
        <span className="upload-or">or</span>

        <button className="browse-btn" onClick={handleBrowseClick}>
          Browse Files
        </button>

        <p className="supported-text">Supported formats: .xlsx, .xls</p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          className="hidden-input"
        />
      </div>
    </div>
  );
};

export default BulkUploadCandidates;
