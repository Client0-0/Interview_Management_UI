import type { reassignpanel } from "../Models/ReassignPanel";

const API_BASE = "https://localhost:7154/api/CandidateAttendance";

export const ReassignService = {
  // ---------------------------
  // Fetch candidate details
  // ---------------------------
  async getCandidate(candidateId: number) {
    const res = await fetch(`${API_BASE}/candidate/${candidateId}`);
    return res.json();
  },

  // ---------------------------
  // Fetch panel list
  // ---------------------------
  async getPanels() {
    const res = await fetch(`${API_BASE}/UserPanel`);
    return res.json();
  },

  // ---------------------------
  // Submit Reassignment
  // ---------------------------
  async postReassign(data: reassignpanel) {
    const res = await fetch(`${API_BASE}/PostReassignPanel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return res;
  },
};
