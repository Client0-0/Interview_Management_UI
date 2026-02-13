import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  exp: number;
}

export const getUserRole = (): string | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const decoded = jwtDecode<JwtPayload>(token);
  return decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
};
