
import { useState, type ChangeEvent } from "react";
import type { AddUserDto } from "../../../Models/user";
import { adminAddNewUser } from "../../../Services/User.Service";
import { notifySuccess, notifyError } from "../../../Utils/toastHelper";
import "./Styles/Model.css";
import { useNavigate } from "react-router-dom";
import {
  validateEmail,
  validatePassword,
  validatePhone,
  validateRequired,
} from "../../../Utils/validation";

const AddMentorModal: React.FC = () => {
  const navigate = useNavigate();
  const onClose = () => {
    navigate(-1);
  };
  const [form, setForm] = useState<AddUserDto>({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    roleName: "Mentor",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AddUserDto, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof AddUserDto, boolean>>>({});

  const validateField = (name: keyof AddUserDto, value: string) => {
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
      case "password":
        error = validatePassword(value);
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error || "" }));
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (touched[name as keyof AddUserDto]) {
      validateField(name as keyof AddUserDto, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateField(name as keyof AddUserDto, value);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name as keyof AddUserDto, value);
  };

  const handleSubmit = async () => {
    const newErrors: Partial<Record<keyof AddUserDto, string>> = {};
    let isValid = true;

    (["fullName", "email", "phone", "password"] as Array<keyof AddUserDto>).forEach((key) => {
      let error = null;
      if (key === "email") error = validateEmail(form.email);
      else if (key === "phone") error = validatePhone(form.phone);
      else if (key === "password") error = validatePassword(form.password);
      else error = validateRequired(form[key], "Full Name");

      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched({ fullName: true, email: true, phone: true, password: true });

    if (!isValid) return;

    try {
      await adminAddNewUser(form);
      notifySuccess("User added successfully");
      onClose();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      notifyError(message);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal large">
        <div className="modal-header">
          <h3>Add New Mentor</h3>
          <button className="close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-grid two-col">
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
              placeholder="hr@example.com"
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
            Password
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </label>
        </div>

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn primary" onClick={handleSubmit}>
            Add Mentor
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMentorModal;

