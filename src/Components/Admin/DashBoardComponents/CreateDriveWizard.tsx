/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import CreateDriveModal from "../AddDashBoardComponents/CreateDriveModal";
import SettingsUI from "./SettingsUI";
import FeedbackConfig from "./FeedbackConfig";
import { createDrives } from "../../../Services/User.Service";
import type { DriveFormData, SettingsData, FeedbackData } from "../../../Models/user";

interface CreateDriveWizardProps {
  onClose: () => void;
}

export default function DriveWizard({ onClose }: CreateDriveWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [driveData, setDriveData] = useState<DriveFormData | null>(null);
  const [settingsData, setSettingsData] = useState<SettingsData | null>(null);
  const [_feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);

  // ================= HANDLERS =================

  const handleDriveNext = (data: DriveFormData) => {
    setDriveData(data);
    setStep(2);
  };

  const handleSettingsSave = (data: SettingsData) => {
    setSettingsData(data);
    setStep(3);
  };

  const handleFeedbackSave = (data: FeedbackData) => {
    setFeedbackData(data);
    handleFinalSubmit(data);
  };

  const handleFinalSubmit = async (feedback: FeedbackData) => {
    if (!driveData || !settingsData) return;

    const payload = {
      driveName: driveData.driveName,
      driveDate: driveData.driveDate,
      technicalRounds: driveData.technicalRounds,
      coordinationTeam: {
        hrs: driveData.hrs.map((h) => h.userId),
        mentors: driveData.mentors.map((m) => m.userId),
        panelMembers: driveData.panels.map((p) => p.userId),
      },
      hrConfiguration: {
        allowBulkUpload: settingsData.allowBulkUpload,
        allowPanelReassign: settingsData.allowPanelReassignment,
        canEditSubmittedFeedback: settingsData.canEditSubmittedFeedback,
        requireApprovalForReassignment: settingsData.requireApprovalForReassignment,
      },
      mentorConfiguration: {
        allowPanelReassign: settingsData.allowPanelReassignment,
        canViewFeedback: settingsData.canViewFeedback,
        requireApprovalForReassignment: settingsData.requireApprovalForReassignment,
      },
      panelConfiguration: {
        allowPanelReassign: settingsData.allowPanelReassignment,
        canEditSubmittedFeedback: settingsData.panelCanEditFeedback,
        requireApprovalForReassignment: settingsData.requireApprovalForReassignment,
      },
      panelVisibilityConfiguration: {
        showPhone: settingsData.showPhone,
        showEmail: settingsData.showEmail,
        showPreviousCompany: settingsData.showPrevCompany,
        showResume: settingsData.showResume,
        showCollege: settingsData.showCollege,
        showAddress: settingsData.showAddress,
        showLinkedIn: settingsData.showLinkedIn,
        showGitHub: settingsData.showGithub,
      },
      feedbackSettings: feedback,
      notificationConfiguration: {
        emailNotificationEnabled: settingsData.emailNotifications,
      },
    };

    try {
      await createDrives(payload);
      alert("Drive created successfully");
      onClose();
      setStep(1);
      setDriveData(null);
      setSettingsData(null);
    } catch (err) {
      console.error(err);
      alert("Failed to create drive");
    }

  };

  // ================= RENDER =================

  return (
    <>
      {step === 1 && (
        <CreateDriveModal
          onClose={onClose}
          onNext={handleDriveNext}
        />
      )}

      {step === 2 && driveData && (
        <SettingsUI
          onBack={() => setStep(1)}
          onSave={handleSettingsSave}
        />
      )}

      {step === 3 && driveData && settingsData && (
        <FeedbackConfig
          onBack={() => setStep(2)}
          onSave={handleFeedbackSave}
        />
      )}
    </>
  );
}
