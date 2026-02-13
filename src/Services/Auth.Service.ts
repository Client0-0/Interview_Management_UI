import type { LoginFormState } from "../Components/Login/Login";
import type { SignUpFormState } from "../Components/Signup";
import api from "./Api"
import { clearItem } from "./LocalStorage.Service";

export const addUser=async(formData:SignUpFormState)=>{
    return await api.post("/api/auth/user/signup",formData)
}

export const login=async (formData:LoginFormState)=>{
    return await api.post("/Auth/token",formData);
}

export const logout=()=>{
    clearItem();
}