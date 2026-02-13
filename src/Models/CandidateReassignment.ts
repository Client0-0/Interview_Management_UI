import type { DriveCandidate } from "./DriveCandidate";
import type { User } from "./user";

export interface CandidateReassignment {
  reassignId: number;
  driveCandidateId: number;
  previousUserId: number;
  newUserId: number;
  requestedBy: number;
  requireApproval: boolean;
  approvedBy?: number | null;
  approvedDate?: string | null;
  requestedDate: string;

  driveCandidate?: DriveCandidate | null;
  previousUser?: User | null;
  newUser?: User | null;
  requester?: User | null;
  approver?: User | null;
}
