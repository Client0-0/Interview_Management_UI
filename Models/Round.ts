import type { DriveCandidate } from "./DriveCandidate";
import type { User } from "./user";

export interface Round {
  roundId: number;
  driveCandidateId: number;
  interviewerId: number;
  roundType: string;
  status: string;
  result: string;

  driveCandidate?: DriveCandidate | null;
  interviewer?: User | null;
}
