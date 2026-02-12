import type { DriveCandidate } from "./DriveCandidate";
import type { DriveMember } from "./DriveMember";
import type { DriveRoleConfiguration } from "./DriveRoleConfiguration";
import type { FeedbackConfiguration } from "./FeedbackConfiguration";
import type { PanelVisibilitySettings } from "./PanelVisibilitySettings";
import type { Round } from "./Round";
import type { User } from "./user";

export interface Drive {
  driveId: number;
  driveName: string;
  driveDate: string;
  technicalRounds: number;
  status: string;
  createdBy: number;
  createdDate: string;

  creator?: User | null;
  driveMembers: DriveMember[];
  driveRoleConfigurations: DriveRoleConfiguration[];
  panelVisibilitySettings?: PanelVisibilitySettings | null;
  notificationSettings?: NotificationOptions | null;
  feedbackConfiguration?: FeedbackConfiguration | null;
  candidateDrives: DriveCandidate[];
  rounds: Round[];
  requests: Request[];
}
