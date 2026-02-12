import type { Drive } from "./Drive";

export interface PanelVisibilitySettings {
  visibilityId: number;
  driveId: number;
  showPhone: boolean;
  showEmail: boolean;
  showPreviousCompany: boolean;
  showResume: boolean;
  showCollege: boolean;
  showAddress: boolean;
  showLinkedIn: boolean;
  showGitHub: boolean;

  drive?: Drive | null;
}
