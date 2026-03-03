import React, { useState } from "react";
import "../Styles/SetNewPassword.css";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { notifyError, notifySuccess } from "../../Utils/toastHelper";

interface FormState {
    newPassword: string;
    confirmPassword: string;
}
interface ErrorState {
    newPassword?: string;
    confirmPassword?: string;
}

const getStrength = (
    pwd: string
): { label: string; cls: string; pct: number } => {
    if (pwd.length === 0) return { label: "", cls: "", pct: 0 };
    if (pwd.length < 6) return { label: "Weak", cls: "weak", pct: 33 };
    const hasUpper = /[A-Z]/.test(pwd);
    const hasDigit = /\d/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
    const score = [pwd.length >= 8, hasUpper, hasDigit, hasSpecial].filter(
        Boolean
    ).length;
    if (score <= 2) return { label: "Medium", cls: "medium", pct: 66 };
    return { label: "Strong", cls: "strong", pct: 100 };
};

const SetNewPassword: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { email, otp } = (location.state as {
        email?: string;
        otp?: string;
    }) ?? {};

    const [form, setForm] = useState<FormState>({
        newPassword: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState<ErrorState>({});
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const strength = getStrength(form.newPassword);

    const validate = (f: FormState): boolean => {
        const temp: ErrorState = {};
        if (!f.newPassword) {
            temp.newPassword = "New password is required.";
        } else if (f.newPassword.length < 6) {
            temp.newPassword = "Password must be at least 6 characters.";
        }
        if (!f.confirmPassword) {
            temp.confirmPassword = "Please confirm your new password.";
        } else if (f.newPassword !== f.confirmPassword) {
            temp.confirmPassword = "Passwords do not match.";
        }
        setErrors(temp);
        return Object.keys(temp).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updated = { ...form, [e.target.name]: e.target.value };
        setForm(updated);
        validate(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate(form)) return;

        setIsLoading(true);
        try {
            // TODO: wire up to real API — e.g. await resetPassword({ email, otp, newPassword: form.newPassword })
            await new Promise((r) => setTimeout(r, 900)); // mock delay
            notifySuccess("Password reset successfully! Please sign in.");
            navigate("/login");
        } catch {
            notifyError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // If user lands here directly without going through the flow, redirect
    if (!email || !otp) {
        return (
            <div className="snp-wrapper">
                <div className="snp-card">
                    <div className="snp-icon-circle">
                        <i className="fa-solid fa-triangle-exclamation" />
                    </div>
                    <h2 className="snp-title">Session Expired</h2>
                    <p className="snp-subtitle">
                        This page requires a valid OTP session. Please start over.
                    </p>
                    <Link to="/forgot-password" className="snp-btn-submit">
                        <i className="fa-solid fa-arrow-left" /> Back to Forgot Password
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="snp-wrapper">
            <div className="snp-card">
                <div className="snp-icon-circle">
                    <i className="fa-solid fa-lock-open" />
                </div>

                <h2 className="snp-title">Set New Password</h2>
                <p className="snp-subtitle">
                    Create a strong new password for{" "}
                    <strong>{email}</strong>.
                </p>

                <form onSubmit={handleSubmit} noValidate>
                    {/* New Password */}
                    <div className="snp-form-group">
                        <label htmlFor="snp-new">New Password</label>
                        <div className="snp-input-box">
                            <span className="snp-input-icon">
                                <i className="fa-solid fa-lock" />
                            </span>
                            <input
                                id="snp-new"
                                type={showNew ? "text" : "password"}
                                name="newPassword"
                                value={form.newPassword}
                                onChange={handleChange}
                                placeholder="Enter new password"
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                className="snp-eye-btn"
                                onClick={() => setShowNew(!showNew)}
                                aria-label="Toggle new password visibility"
                            >
                                <i className={`fa-solid ${showNew ? "fa-eye" : "fa-eye-slash"}`} />
                            </button>
                        </div>
                        {errors.newPassword && <small>{errors.newPassword}</small>}
                    </div>

                    {/* Strength bar */}
                    {form.newPassword.length > 0 && (
                        <div className="snp-strength-bar">
                            <div className="snp-strength-track">
                                <div
                                    className={`snp-strength-fill ${strength.cls}`}
                                    style={{ width: `${strength.pct}%` }}
                                />
                            </div>
                            <span className={`snp-strength-label ${strength.cls}`}>
                                {strength.label}
                            </span>
                        </div>
                    )}

                    {/* Confirm Password */}
                    <div className="snp-form-group">
                        <label htmlFor="snp-confirm">Confirm New Password</label>
                        <div className="snp-input-box">
                            <span className="snp-input-icon">
                                <i className="fa-solid fa-lock" />
                            </span>
                            <input
                                id="snp-confirm"
                                type={showConfirm ? "text" : "password"}
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm new password"
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                className="snp-eye-btn"
                                onClick={() => setShowConfirm(!showConfirm)}
                                aria-label="Toggle confirm password visibility"
                            >
                                <i
                                    className={`fa-solid ${showConfirm ? "fa-eye" : "fa-eye-slash"}`}
                                />
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <small>{errors.confirmPassword}</small>
                        )}
                    </div>

                    <button
                        type="submit"
                        className={`snp-btn-submit${isLoading ? " snp-btn-loading" : ""}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="snp-spinner" /> Saving…
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-floppy-disk" /> Save New Password
                            </>
                        )}
                    </button>
                </form>

                <p className="snp-back-text">
                    <Link to="/login">
                        <i className="fa-solid fa-arrow-left" /> Back to Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SetNewPassword;
