import React, { useEffect, useState } from "react";
import "./Styles/UserEdit.css";
import type {
  UpdateUserRequest,
  UpdateUserPatchRequest,
} from "../../../Models/user";
import { updateUser } from "../../../Services/User.Service";
import { notifySuccess, notifyError } from "../../../Utils/toastHelper";

interface UserEditProps {
  user: UpdateUserRequest;
  onClose: () => void;
  onSave: (updatedUser: UpdateUserRequest) => void;
}

const UserEdit: React.FC<UserEditProps> = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState<UpdateUserRequest>(user);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      // PATCH payload (send only changed fields)
      const payload: UpdateUserPatchRequest = {
        userId: formData.userId,
      };

      if (formData.fullName !== user.fullName) {
        payload.fullName = formData.fullName;
      }

      if (formData.phone !== user.phone) {
        payload.phone = formData.phone;
      }

      if (formData.roleName !== user.roleName) {
        payload.roleName = formData.roleName;
      }

      if (formData.isActive !== user.isActive) {
        payload.isActive = formData.isActive;
      }
      if (formData.email !== user.email) {
        payload.email = formData.email;
      }

      await updateUser(payload);

      notifySuccess("User updated successfully");
      onSave(formData);
      onClose();
    } catch (error) {
      notifyError("Failed to update user");
      console.error(error);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        {/* HEADER */}
        <div className="modal-header">
          <h3>Edit {formData.roleName}</h3>
          <button className="close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* FORM */}
        <div className="modal-grid">
          <label>
            Full Name
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
          </label>

          <label>
            Email
            <input name="email" value={formData.email} disabled />
          </label>

          <label>
            Phone
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </label>

          <label>
            Role
            <select
              name="roleName"
              value={formData.roleName}
              onChange={handleChange}
            >
              <option value="Admin">Admin</option>
              <option value="HR">HR</option>
              <option value="Mentor">Mentor</option>
              <option value="Panel">Panel</option>
            </select>
          </label>

          <label>
            Status
            <select
              value={formData.isActive ? "Active" : "Inactive"}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isActive: e.target.value === "Active",
                }))
              }
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>
        </div>

        {/* FOOTER */}
        <div className="modal-actions">
          <button className="btn cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn primary" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserEdit;
