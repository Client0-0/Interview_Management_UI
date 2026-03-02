import React, { useState } from "react";
import "../Styles/ChangePasswordPage.css";
import { Link } from "react-router-dom";
import { ChangePassword } from "../../Services/User.Service";
import { getItem } from "../../Services/LocalStorage.Service";
import { notifyError, notifySuccess } from "../../Utils/toastHelper";
import axios from "axios";

interface PasswordErrors {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const ChangePasswordPage: React.FC = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [errors, setErrors] = useState<PasswordErrors>({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const validate = (): boolean => {
        const newErrors: PasswordErrors = {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        };
        let valid = true;

        if (!oldPassword) {
            newErrors.oldPassword = "Current password is required.";
            valid = false;
        }

        if (!newPassword) {
            newErrors.newPassword = "New password is required.";
            valid = false;
        } else if (newPassword.length < 6) {
            newErrors.newPassword = "Password must be at least 6 characters.";
            valid = false;
        } else if (newPassword === oldPassword) {
            newErrors.newPassword = "New password must differ from the current one.";
            valid = false;
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Please confirm your new password.";
            valid = false;
        } else if (confirmPassword !== newPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        try {
            await ChangePassword({
                Email: getItem("email"),
                OldPassword: oldPassword,
                newPassword: newPassword,
            });
            notifySuccess("Password updated successfully!");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setErrors({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const message = err.response?.data?.error || "Something went wrong.";
                notifyError(message);
            } else {
                notifyError("An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="cp-wrapper">
            <div className="cp-card">
                <div className="cp-icon-circle">
                    <i className="fa-solid fa-shield-halved"></i>
                </div>

                <h2 className="cp-title">Change Password</h2>
                <p className="cp-subtitle">
                    Update your account password to keep it secure.
                </p>

                <form onSubmit={handleSave} noValidate>
                    {/* Old Password */}
                    <div className="cp-form-group">
                        <label htmlFor="cp-old">Current Password</label>
                        <div className="cp-input-box">
                            <span className="cp-input-icon">
                                <i className="fa-solid fa-key"></i>
                            </span>
                            <input
                                id="cp-old"
                                type={showOld ? "text" : "password"}
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                placeholder="Enter current password"
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="cp-eye-btn"
                                onClick={() => setShowOld(!showOld)}
                                aria-label="Toggle old password visibility"
                            >
                                <i className={`fa-solid ${showOld ? "fa-eye" : "fa-eye-slash"}`}></i>
                            </button>
                        </div>
                        {errors.oldPassword && <small>{errors.oldPassword}</small>}
                    </div>

                    {/* New Password */}
                    <div className="cp-form-group">
                        <label htmlFor="cp-new">New Password</label>
                        <div className="cp-input-box">
                            <span className="cp-input-icon">
                                <i className="fa-solid fa-lock"></i>
                            </span>
                            <input
                                id="cp-new"
                                type={showNew ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                className="cp-eye-btn"
                                onClick={() => setShowNew(!showNew)}
                                aria-label="Toggle new password visibility"
                            >
                                <i className={`fa-solid ${showNew ? "fa-eye" : "fa-eye-slash"}`}></i>
                            </button>
                        </div>
                        {errors.newPassword && <small>{errors.newPassword}</small>}
                    </div>

                    {/* Confirm Password */}
                    <div className="cp-form-group">
                        <label htmlFor="cp-confirm">Confirm New Password</label>
                        <div className="cp-input-box">
                            <span className="cp-input-icon">
                                <i className="fa-solid fa-lock"></i>
                            </span>
                            <input
                                id="cp-confirm"
                                type={showConfirm ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                className="cp-eye-btn"
                                onClick={() => setShowConfirm(!showConfirm)}
                                aria-label="Toggle confirm password visibility"
                            >
                                <i className={`fa-solid ${showConfirm ? "fa-eye" : "fa-eye-slash"}`}></i>
                            </button>
                        </div>
                        {errors.confirmPassword && <small>{errors.confirmPassword}</small>}
                    </div>

                    {/* Strength hints */}
                    {newPassword.length > 0 && (
                        <div className="cp-strength-bar">
                            <div
                                className={`cp-strength-fill ${newPassword.length < 6
                                        ? "weak"
                                        : newPassword.length < 10
                                            ? "medium"
                                            : "strong"
                                    }`}
                            ></div>
                            <span className="cp-strength-label">
                                {newPassword.length < 6
                                    ? "Weak"
                                    : newPassword.length < 10
                                        ? "Medium"
                                        : "Strong"}
                            </span>
                        </div>
                    )}

                    <button
                        type="submit"
                        className={`cp-btn-submit${isLoading ? " cp-btn-loading" : ""}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="cp-spinner"></span> Updating…
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-floppy-disk"></i> Update Password
                            </>
                        )}
                    </button>

                    <p className="cp-back-text">
                        <Link to="/login">
                            <i className="fa-solid fa-arrow-left"></i> Back to Sign In
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordPage;
