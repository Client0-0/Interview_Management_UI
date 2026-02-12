import type { Role } from "./Role";
import type { User } from "./user";

export interface UserRole {
  userRoleId: number;
  userId: number;
  roleId: number;

  user?: User | null;
  role?: Role | null;
}
