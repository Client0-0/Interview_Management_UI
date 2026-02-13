export interface DriveConfig {
  hrConfiguration: {
    allowBulkUpload: boolean;
    canEditSubmittedFeedback: boolean;
    allowPanelReassign: boolean;
    requireApprovalForReassignment: boolean;
  };
  panelConfiguration: {
    canEditSubmittedFeedback: boolean;
    allowPanelReassign: boolean;
    requireApprovalForReassignment: boolean;
  };
  mentorConfiguration: {
    canViewFeedback: boolean;
    allowPanelReassign: boolean;
    requireApprovalForReassignment: boolean;
  };
  panelVisibilitySettings: {
    showPhone: boolean;
    showEmail: boolean;
    showPreviousCompany: boolean;
    showResume: boolean;
    showCollege: boolean;
    showAddress: boolean;
    showLinkedIn: boolean;
    showGitHub: boolean;
  };
  notificationSettings: {
    emailNotificationEnabled: boolean;
  };
  feedbackConfiguration: {
    overallRatingRequired: boolean;
    technicalSkillRequired: boolean;
    communicationRequired: boolean;
    problemSolvingRequired: boolean;
    recommendationRequired: boolean;
    overallFeedbackRequired: boolean;
  };
}

export interface DriveViewProps {
  data: DriveConfig;
  onClose: () => void;
  mode?: "view" | "edit";
}
