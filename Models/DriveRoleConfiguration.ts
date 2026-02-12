import type { Drive } from "./Drive";
import type { Role } from "./Role";

export interface DriveRoleConfiguration {
  configId: number;
  driveId: number;
  roleId: number;
  allowPanelReassign: boolean;
  canViewFeedback: boolean;
  allowBulkUpload: boolean;
  canEditSubmittedFeedback: boolean;
  requireApprovalForReassignment: boolean;

  drive?: Drive | null;
  role?: Role | null;
}
