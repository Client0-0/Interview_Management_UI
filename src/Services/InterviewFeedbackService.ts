export interface Feedback {
  overallRating: number;
  technicalSkills: string;
  communicationSkills: string;
  problemSolving: string;
  overallFeedback: string;
  recommendation: string;
}

// Dummy service, replace with real API call
export const submitFeedback = async (feedback: Feedback) => {
  return new Promise<void>((resolve) => {
    console.log("Submitting feedback:", feedback);
    setTimeout(() => {
      resolve();
    }, 1000);
  });
};
