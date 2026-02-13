import type { User } from "./user";

export interface UserPermission {
  userId: number;
  action: string;
  view: boolean;
  add: boolean;
  update: boolean;
  delete: boolean;

  user?: User | null;
}
