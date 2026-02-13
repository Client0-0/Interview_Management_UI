import type { DriveCandidate } from "./DriveCandidate";
import type { Feedback } from "./Feedback";
import type { User } from "./user";

export interface Interview {
  interviewId: number;
  driveCandidateId: number;
  interviewerId: number;
  interviewDate: string;

  driveCandidate?: DriveCandidate | null;
  interviewer?: User | null;
  feedback?: Feedback | null;
}
