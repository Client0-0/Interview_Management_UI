import axios from "axios";

export interface PostReassignPayload {
  candidateId: number;
  reason: string;
  additionalNotes?: string;
  newPanelId: number;
}

const API_BASE = "https://localhost:7154/api/CandidateAttendance";

export const getPanels = async () => {
  const res = await axios.get(`${API_BASE}/UserPanel`);
  return res.data;
};

export const sendReassignRequest = async (payload: PostReassignPayload) => {
  const res = await axios.post(`${API_BASE}/ReassignPanel`, payload);
  return res.data;
};
