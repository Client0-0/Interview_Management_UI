import React, { useState, type ChangeEvent, type FormEvent } from "react";
import "../Styles/ForgotPassword.css";

interface FormState {
  Otp?: number;
}

interface ErrorState {
  Otp?: string;
}

const Otp: React.FC = () => {
  const [form, setForm] = useState<FormState>({});
  const [errors, setErrors] = useState<ErrorState>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newForm = { ...form, [e.target.name]: e.target.value };
    setForm(newForm);
    validate(newForm);
  };

  const validate = (newForm: FormState): boolean => {
    const temp: ErrorState = {};

    if (!newForm.Otp) temp.Otp = "Otp is required...";
    // else if (!/\S+@\S+\.\S+/.test(newForm.Otp))
    //   temp.Otp = "Invalid email format";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate(form)) return;
    // submit logic
  };

  return (
    <div className="fp-wrapper">
      <div className="fp-card">
        <div className="fp-icon-circle">
          <span className="fp-lock-icon">
            <i className="fa-solid fa-unlock-keyhole"></i>
          </span>
        </div>

        <h2 className="fp-title">Verify Your Identity</h2>
        <p className="fp-subtitle">
          Enter the one-time password we sent to your email.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="fp-form-group">
            <label>OTP</label>
            <div className="fp-input-box">
              <span className="fp-input-icon">
                <i className="fa-solid fa-shield-halved"></i>
              </span>
              <input
                type="number"
                name="Otp"
                placeholder="Enter Otp"
                onChange={handleChange}
              />
            </div>
            {errors.Otp && <small>{errors.Otp}</small>}
          </div>

          <button className="fp-btn-submit">Verify</button>

          <p className="fp-back-text">
            <a href="/login">Back to sign in</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Otp;
