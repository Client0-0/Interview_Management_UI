import type { DriveMember } from "./DriveMember";
import type { DriveRoleConfiguration } from "./DriveRoleConfiguration";
import type { UserRole } from "./UserRole";

export interface Role {
  roleId: number;
  roleName: string;

  userRoles: UserRole[];
  driveRoleConfigurations: DriveRoleConfiguration[];
  driveMembers: DriveMember[];
}
