import type { Drive } from "./Drive";

export interface FeedbackConfiguration {
  feedbackConfigId: number;
  driveId: number;
  overallRatingRequired: boolean;
  technicalSkillRequired: boolean;
  communicationRequired: boolean;
  problemSolvingRequired: boolean;
  recommendationRequired: boolean;
  overallFeedbackRequired: boolean;

  drive?: Drive | null;
}
