// src/Utils/drivePayloadBuilder.ts

import type {
  DriveFormData,
  SettingsData,
  FeedbackData,
} from "../Models/user";

export function buildBackendPayload(
  drive: DriveFormData,
  settings: SettingsData,
  feedback: FeedbackData
) {
  return {
    driveName: drive.driveName,
    driveDate: new Date(drive.driveDate).toISOString(),
    technicalRounds: drive.technicalRounds,

    coordinationTeam: {
      hrs: drive.hrs.map(h => h.userId),
      mentors: drive.mentors.map(m => m.userId),
      panelMembers: drive.panels.map(p => p.userId),
    },

    hrConfiguration: {
      allowBulkUpload: settings.allowBulkUpload,
      canEditSubmittedFeedback: settings.canEditSubmittedFeedback,
      allowPanelReassign: settings.allowPanelReassignment,
      requireApprovalForReassignment:
        settings.requireApprovalForReassignment,
    },

    mentorConfiguration: {
      canViewFeedback: settings.canViewFeedback,
      allowPanelReassign: settings.allowPanelReassignment,
      requireApprovalForReassignment:
        settings.requireApprovalForReassignment,
    },

    panelConfiguration: {
      canEditSubmittedFeedback: settings.panelCanEditFeedback,
      allowPanelReassign: settings.allowPanelReassignment,
      requireApprovalForReassignment:
        settings.requireApprovalForReassignment,
    },

    panelVisibilityConfiguration: {
      showPhone: settings.showPhone,
      showEmail: settings.showEmail,
      showPreviousCompany: settings.showPrevCompany,
      showResume: settings.showResume,
      showCollege: settings.showCollege,
      showAddress: settings.showAddress,
      showLinkedIn: settings.showLinkedIn,
      showGitHub: settings.showGithub,
    },

    notificationConfiguration: {
      emailNotificationEnabled: settings.emailNotifications,
    },

    feedbackSettings: {
      overallRatingRequired: feedback.overallRatingRequired,
      technicalSkillRequired: feedback.technicalSkillRequired,
      communicationRequired: feedback.communicationRequired,
      problemSolvingRequired: feedback.problemSolvingRequired,
      recommendationRequired: feedback.recommendationRequired,
      overallFeedbackRequired: feedback.overallFeedbackRequired,
    },
  };
}
