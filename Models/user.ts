import type { CandidateReassignment } from "./CandidateReassignment";
import type { Drive } from "./Drive";
import type { DriveCandidate } from "./DriveCandidate";
import type { DriveMember } from "./DriveMember";
import type { Interview } from "./Interview";
import type { Round } from "./Round";
import type { UserPermission } from "./UserPermission";
import type { UserRole } from "./UserRole";

export interface User {
  userId: number;
  fullName: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdDate: string;
  updatedDate?: string | null;
  
  userRoles: UserRole[];
  userPermissions: UserPermission[];
  createdDrives: Drive[];
  driveMembers: DriveMember[];
  recruitedCandidates: DriveCandidate[];
  interviewedPanels: Round[];
  interviews: Interview[];
  requestedReassignments: CandidateReassignment[];
  approvedReassignments: CandidateReassignment[];
}


export interface AddUserDto {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  roleName: string;
 
}

export interface AddCandidateRequest {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  college: string;
  previousCompany: string;
  experienceLevelName: string;
  techStack: string[];
  resumeUrl: string;
  linkedInUrl: string;
  gitHubUrl: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalCandidates: number;
  totalPanelMembers: number;
  totalMentors: number;
  totalInterviews: number;
  totalHrs: number;
  totalCandidatesHired: number;
  totalCandidatesRejected: number;
}

// models/User.ts
export interface Users {
  
  userId: number;
  fullName: string;
  email: string;
  phone: string;
  isActive:boolean;
  roleName: UserRoles;
  createdDate: string;   // ISO string
  updatedDate: string;   // ISO string
}

export interface UpdateUserRequest {
  userId: number;
  fullName?: string;
  email?: string;
  phone?: string;
  isActive?:boolean;
  roleName?: UserRoles;
}

// Used for PATCH (partial update)
export interface UpdateUserPatchRequest {
  userId: number;
  fullName?: string;
  email?: string;
  phone?: string;
  roleName?: string;
  isActive?: boolean;
}

export interface UpdateCandidatePatchRequest {
  candidateId: number;

  fullName?: string;
  phone?: string;
  address?: string;
  college?: string;
  previousCompany?: string;
  experienceLevelName?: string;
  techStack?: string[];
  resumeUrl?: string;
  linkedInUrl?: string;
  gitHubUrl?: string;
}


// models/UserRole.ts
export type UserRoles =
  | "ADMIN"
  | "HR"
  | "MENTOR"
  | "PANEL"
  | "CANDIDATE";

  export interface CandidateDto {
  candidateId: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  college: string;
  previousCompany: string;
  candidateExperienceLevel: string;
  techStack: string[];
  resumeUrl: string;
  linkedInUrl: string;
  gitHubUrl: string;
  createdDate: string; // ISO string from backend
}

export interface ApiResponse<T> {
  data: T;
  warnings: string[];
  errors: string[];
}


export interface UserRef {
  userId: number;
}
/* ================= DRIVE FORM ================= */

export interface DriveFormData {
  driveName: string;
  driveDate: string;
  technicalRounds: number;

  hrs: UserRef[];
  mentors: UserRef[];
  panels: UserRef[];
}

/* ================= SETTINGS ================= */

export interface SettingsData {
  allowPanelReassignment: boolean;
  requireMentorApproval: boolean;
  allowBulkUpload: boolean;
  autoAssignPanels: boolean;
  panelCanEditFeedback: boolean;
  candidateCanViewFeedback: boolean;
  emailNotifications: boolean;
  canEditSubmittedFeedback: boolean;
  requireApprovalForReassignment: boolean;
  canViewFeedback: boolean;

  showPhone: boolean;
  showEmail: boolean;
  showPrevCompany: boolean;
  showResume: boolean;
  showCollege: boolean;
  showAddress: boolean;
  showLinkedIn: boolean;
  showGithub: boolean;
}

/* ================= FEEDBACK ================= */

export interface FeedbackData {
  overallRatingRequired: boolean;
  technicalSkillRequired: boolean;
  communicationRequired: boolean;
  problemSolvingRequired: boolean;
  recommendationRequired: boolean;
  overallFeedbackRequired: boolean;
}

export interface DriveApiResponse {
  driveId: number;
  driveName: string;
  driveDate: string;
  driveStatus: string;
  creatorName: string;
  createdDate: string;
}

export interface PaginatedDriveResponse {
  items: DriveApiResponse[];
  totalCount: number;
}

export interface DriveMemberApi {
  driveId: number;
  driveName: string;
  driveDate: string;
  driveStatus: string;
  userName: string;
  userEmail: string;
  roleName: string;
}

export interface DriveMemberResponse {
  data: DriveMemberApi[];
  warnings: string[];
  errors: string[];
}


/*mentor */

export interface MentorCandidate{
  driveId:number;
  driveName:string;
  driveDate:string;
  candidateId:number;
  fullName:string;
  email:string;
  phone:string;
  address:string;
  college:string;
  previousCompany:string;
  status:number;
  roundType:string;
  roundStatus:string;
  roundResult:string;
  interviewerName:string;
  interviewerEmail:string;
  interviewerPhone:string;
  interviewerId:number;
  candidateExperienceLevel:string;
  techStack:string[];
  resumeUrl:string;
  linkedInUrl:string;
  gitHubUrl:string;
  userName:string;
  useremail:string;
  attendanceStatus?:"Present"|"Absent"|null;
}

export interface CandidateAttendanceMentorDto {
  driveId: number;
  candidateId: number;
  attendanceStatus: "Present" | "Absent";
}


