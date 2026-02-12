import type { Drive } from "./Drive";
import type { Role } from "./Role";
import type { User } from "./user";

export interface DriveMember {
  driveMemberId: number;
  driveId: number;
  userId: number;
  roleId: number;

  drive?: Drive | null;
  user?: User | null;
  role?: Role | null;
}
