import type { DriveCandidate } from "./DriveCandidate";
import type { Feedback } from "./Feedback";
import type { Interview } from "./Interview";

export interface Candidate {
  candidateId: number;
  fullName: string;
  phone: string;
  email: string;
  resumeUrl?: string | null;
  previousCompany?: string | null;
  college?: string | null;
  address?: string | null;
  linkedInUrl?: string | null;
  gitHubUrl?: string | null;
  createdDate: string;

  driveCandidates: DriveCandidate[];
  interviews: Interview[];
  feedbacks: Feedback[];
  requests: Request[];

  //extra
  interviewRound: string;//extra
  candidatePosition: string;
 
  time: string;
  panel: string;
  room?: string;
  status?:string;
  Experience?:number;
  resumeSummary?:string;
  Skills?:string[];
}

