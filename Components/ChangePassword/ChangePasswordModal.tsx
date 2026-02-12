import React, { useState } from "react";
import "../Styles/ChangePasswordModal.css";
import { ChangePassword } from "../../Services/User.Service";
import { getItem } from "../../Services/LocalStorage.Service";
import { notifyError, notifySuccess } from "../../Utils/toastHelper";
import axios from "axios";

export interface Props {
  isOpen: boolean;
  onClose: () => void;
}
export interface ChangePasswordRequest {
  Email: string;
  OldPassword: string;
  newPassword: string;
}
export interface PasswordErrors {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
export const ChangePasswordModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState<PasswordErrors>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: PasswordErrors = {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
    let valid = true;

    if (!oldPassword) {
      newErrors.oldPassword = "Old password is required";
      valid = false;
    }

    if (!newPassword) {
      newErrors.newPassword = "New password is required";
      valid = false;
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
      valid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
      valid = false;
    } else if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSave = async () => {
    if (!validate()) return;
    //alert("Password updated successfully!");
    try {
      const body: ChangePasswordRequest = {
        Email: getItem("email"),
        OldPassword: oldPassword,
        newPassword: newPassword,
        
      };
      console.log(getItem("email"));
      await ChangePassword(body);
      notifySuccess("Updated Successfully");
      setErrors({ oldPassword: "", newPassword: "", confirmPassword: "" });
      onClose();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data.error || "Something went wrong";
        notifyError(message);
      } else {
        notifyError("An unexpected error occurred");
        console.log("Non-Axios Error:", err);
      }
    }
  };

  return (
    <>
      <div className="modal-overlay"></div>
      <div className="modal-box">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>

        <h2>
          <i className="fa-solid fa-lock"></i> Change Password
        </h2>

        <div className="form-group">
          <label>
            <i className="fa-solid fa-key"></i> Old Password
          </label>
          <div className="password-wrapper">
            <input
              type={showOld ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter old password"
            />
            <i
              className={`fa-solid ${showOld ? "fa-eye" : "fa-eye-slash"  }`}
              onClick={() => setShowOld(!showOld)}
            ></i>
          </div>
          {errors.oldPassword && <p className="error">{errors.oldPassword}</p>}
        </div>

        <div className="form-group">
          <label>
            <i className="fa-solid fa-lock"></i> New Password
          </label>
          <div className="password-wrapper">
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
            <i
              className={`fa-solid ${showNew ? "fa-eye" : "fa-eye-slash"}`}
              onClick={() => setShowNew(!showNew)}
            ></i>
          </div>
          {errors.newPassword && <p className="error">{errors.newPassword}</p>}
        </div>

        <div className="form-group">
          <label>
            <i className="fa-solid fa-lock"></i> Confirm Password
          </label>
          <div className="password-wrapper">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
            <i
              className={`fa-solid ${showConfirm ? "fa-eye" : "fa-eye-slash"}`}
              onClick={() => setShowConfirm(!showConfirm)}
            ></i>
          </div>
          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
          )}
        </div>

        <div className="buttons">
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};
