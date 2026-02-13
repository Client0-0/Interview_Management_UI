import type { Candidate } from "./Candidate";
import type { CandidateReassignment } from "./CandidateReassignment";
import type { Drive } from "./Drive";
import type { Interview } from "./Interview";
import type { Round } from "./Round";
import type { User } from "./user";

export interface DriveCandidate {
  driveCandidateId: number;
  candidateId: number;
  driveId: number;
  status: string;
  statusSetBy?: number | null;
  createdDate: string;

  candidate?: Candidate | null;
  drive?: Drive | null;
  recruiter?: User | null;
  rounds: Round[];
  interviews: Interview[];
  candidateReassignments: CandidateReassignment[];
}
