export type EditStep = 'basic' | 'settings' | 'feedback' | 'review';

export interface UserRef {
  userId: number;
  fullName: string;
}

export interface Drive {
  driveId: number;
  driveName: string;
  driveDate: string;
  driveStatus: 'Upcoming' | 'Completed' | 'Cancelled';
  technicalRounds: number;
  assignedUsers: {
    hrs: UserRef[];
    mentors: UserRef[];
    panels: UserRef[];
  };
}

export interface DriveConfig {
  hrConfiguration: {
    allowBulkUpload: boolean;
    allowPanelReassign: boolean;
    requireApprovalForReassignment: boolean;
    canEditSubmittedFeedback: boolean;
  };
  panelConfiguration: {
    canEditSubmittedFeedback: boolean;
  };
  mentorConfiguration: {
    canViewFeedback: boolean;
  };
  panelVisibilitySettings: Record<string, boolean>;
  feedbackConfiguration: Record<string, boolean>;
  notificationSettings: {
    emailNotificationEnabled: boolean;
  };
}
