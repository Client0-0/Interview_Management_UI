import React, { useEffect, useState } from "react";
import "./Styles/UserDeactivateModal.css";
import type { Users } from "../../../Models/user";
import { updateUser } from "../../../Services/User.Service";
import { notifyError, notifySuccess } from "../../../Utils/toastHelper";

interface UpdateUserPatchRequest {
  userId: number;
  fullName?: string;
  phone?: string;
  roleName?: string;
  email?: string;
  isActive?: boolean;
}

interface Props {
  isOpen: boolean;
  user: Users | null;
  loading: boolean;
  onConfirm?: (user: Users) => void;
  onClose: () => void;
}

const UserDeactivateModal: React.FC<Props> = ({
  isOpen,
  user,
  loading,
  onConfirm,
  onClose,
}) => {
  const [formData, setFormData] = useState<Users | null>(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleSave = async () => {
    if (!formData || !user) return;

    try {
      setSaving(true);

      // PATCH payload – only changed fields
      const payload: UpdateUserPatchRequest = {
        userId: formData.userId,
      };

      
      payload.isActive = !formData.isActive;
      

      await updateUser(payload);

      notifySuccess(
        `User ${formData.isActive ? "deactivated" : "activated"} successfully`
      );

      onConfirm?.(formData);
      
      onClose();
    } catch (error) {
      notifyError("Failed to update user status");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !user || !formData) return null;

  return (
    <>
      <div className="modal-overlay" />

      <div className="modal-box">
        <h3>{user.roleName} Status Confirmation</h3>

        <p>
          <strong>Name:</strong> {user.fullName}
        </p>
        <p>
          <strong>Role:</strong> {user.roleName}
        </p>

        <p className="warning-text">
          Are you sure you want to{" "}
          <strong>{user.isActive ? "deactivate" : "activate"}</strong> this user?
        </p>

        <div className="modal-actions">
          

          <button
            className="confirm-btn"
            onClick={handleSave}
            disabled={saving || loading}
          >
            {saving ? "Processing..." : "Yes, Confirm"}
          </button>

          <button
            className="cancel-btn"
            onClick={onClose}
            disabled={saving || loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default UserDeactivateModal;
