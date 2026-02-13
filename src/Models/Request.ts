import type { User } from "./user";

export interface Request {
  requestId: number;
  requestType: string;
  subType: string;
  status: string;
  approvedBy?: number | null;
  approvedDate?: string | null;
  requestedBy: number;
  requestedDate: string;

  approver?: User | null;
  requester?: User | null;
}
