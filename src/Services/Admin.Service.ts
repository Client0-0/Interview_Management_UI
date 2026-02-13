// //import type { UpdateUserStatus } from "../Components/Admin/AddDashBoardComponents";
// import type { User } from "../Models/user";
// import api from "./Api"

// export const getAllUsers=async ()=>{
//   return api.get<User[]>("/api/Admin/getAllUsers");
// }

// export const updateUserStatus=(formData:UpdateUserStatus)=>{
//     return api.put("/api/Admin/users/update-status",formData);
// }
import api from './Api';
export const getDashboardStats = async () => {
  return await api.get("/Admin/dashboard/details");
};