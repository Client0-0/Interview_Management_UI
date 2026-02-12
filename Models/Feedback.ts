import type { Interview } from "./Interview";

export interface Feedback {
  feedbackId: number;
  interviewId: number;
  overallRating?: number | null;
  technicalSkill?: number | null;
  communication?: number | null;
  problemSolving?: number | null;
  overallFeedback?: string | null;
  recommendation: string;
  submittedDate: string;

  interview?: Interview | null;
}
