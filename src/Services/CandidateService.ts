// src/services/CandidateService.ts

import type { Candidate } from "../Models/Candidate";
import type { CandidateAttendanceDto } from "../Models/CandidateAttendanceDto";

const API_BASE = "https://localhost:7154/api/CandidateAttendance";

export const CandidateService = {
  /* =========================
     Candidate
     ========================= */

  async getAllCandidates(): Promise<Candidate[]> {
    const res = await fetch(`${API_BASE}/all`);
    if (!res.ok) throw new Error("Failed to fetch candidates");
    return res.json();
  },

  async getCandidateById(id: number): Promise<Candidate> {
    const res = await fetch(`${API_BASE}/candidate/${id}`);
    if (!res.ok) throw new Error("Failed to fetch candidate");
    return res.json();
  },

  /* =========================
     Attendance
     ========================= */

  async getAttendanceById(
    id: number
  ): Promise<{ attendanceStatus: boolean } | null> {
    const res = await fetch(`${API_BASE}/byId/${id}`);
    if (!res.ok) return null;
    return res.json();
  },

  async markAttendance(dto: CandidateAttendanceDto): Promise<void> {
    const res = await fetch(`${API_BASE}/mark`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });

    if (!res.ok) throw new Error("Failed to mark attendance");
  },

  /* =========================
     Interview Feedback
     ========================= */

  async submitInterviewFeedback(payload: {
    candidateId: number;
    feedback: string;
    rating?: number;
    interviewer?: string;
  }) {
    const res = await fetch(`${API_BASE}/candidate/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to submit feedback");
    return res.json();
  },
};
