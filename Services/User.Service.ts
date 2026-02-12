/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ChangePasswordRequest } from "../Components/ChangePassword/ChangePasswordModal"
import type { AddCandidateRequest, AddUserDto, ApiResponse, CandidateAttendanceMentorDto, CandidateDto, MentorCandidate, PaginatedDriveResponse, UpdateCandidatePatchRequest, UpdateUserPatchRequest, Users } from "../Models/user";
import api from "./Api"


export const ChangePassword=(formData:ChangePasswordRequest)=>{
    return api.post("/Auth/password/change",formData)
}

export const adminAddNewUser=(formData:AddUserDto)=>{
    return api.post("/User/add",formData)
}

export const getAllUsers = async () => {
  return await api.get("/User/fetch/all");
};

export const updateUser = async (user: UpdateUserPatchRequest) => {
  return await api.put(`/User/edit/`,user);
};

export const updateCandidate = async (
  payload: UpdateCandidatePatchRequest
) => {
  return await api.put("/Candidate/edit", payload);
};

export const changeUserStatus = async (
  userId: number,
  isActive: boolean
  ) => {
    return await api.put("/User/edit/", {
      userId,
      isActive,
    });
};

export const getAllHrs = async () => {
  return await api.get("/User/fetch/all?role=HR");
};

export const getUserById = async(id: number) => {
  return await api.get<ApiResponse<Users>>(`/user/fetch/${id}`);
};

export const getAllMentors = async () => {
  return await api.get("/User/fetch/all?role=Mentor");
};

export const getAllPanels = async () => {
  return await api.get("/User/fetch/all?role=Panel");
};

export const getAllCandidates = async () => {
  return await api.get("/Candidate/fetch/all");
};

export const getCandidateById = async (id: number) => {
  const res=await api.get<ApiResponse<CandidateDto>>(
    `/Candidate/fetch/${id}`
  );
  return res.data.data;
}



  export const deactivateCandidate = (
    candidateId: number,
    status: "Active" | "Inactive"
  ) => {
    return api.patch(`/${candidateId}/status`, {
      status,
    });
};
export const UserService = {
  async addUser(payload: AddUserDto) {
    const response = await fetch(`${api}/User/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Failed to add user");
    }

    return response.json();
  },
};

export interface CreateDrivePayload {
  driveName: string;
  driveDate: string;
  technicalRounds: number;
  coordinationTeam: {
    hrs: number[];
    mentors: number[];
    panelMembers: number[];
  };
  hrConfiguration: Record<string, boolean>;
  mentorConfiguration: Record<string, boolean>;
  panelConfiguration: Record<string, boolean>;
  panelVisibilityConfiguration: Record<string, boolean>;
  notificationConfiguration: Record<string, boolean>;
  feedbackSettings: Record<string, boolean>;
}

export const createDrives = async (data: any) => {
  return api.post("/drive/create", data); // Replace with your actual backend endpoint
};

export const getAllDrives = async (
  pageNumber = 1,
  pageSize = 20
): Promise<PaginatedDriveResponse> => {
  const response = await api.get("/Drive/fetch/all", {
    params: {
      includePastDrives: true,
      pageNumber,
      pageSize,
    },
  });

  const data = response.data??{};

  // ✅ normalize backend response safely
  return {
    items: Array.isArray(data.items)
      ? data.items
      : Array.isArray(data.data)
      ? data.data
      : [],

    totalCount:
      typeof data.totalCount === "number"
        ? data.totalCount
        : typeof data.count === "number"
        ? data.count
        : 0,
  };
};


export const getDriveConfiguration = async (driveId: number) => {
  const response = await api.get(`/drive/config/fetch/${driveId}`);

  return response.data; 
};

export const getDriveById = async (driveId: number) => {
  if (!driveId) {
    throw new Error("Drive ID is required");
  }

  const response = await api.get(`/drive/fetch/${driveId}`);
  return response.data;
};

// Services/User.Service.ts

export const updateDriveBasicDetails = async (
  payload: {
    driveId: number;
    driveName?: string;
    driveDate?: string;
    technicalRounds?: number;
    driveStatus?: string;
  }
) => {
  return await api.put("/Drive/edit", payload);
};

export const getDriveMembers = async (
  driveId: number,
  roleName: string,
  includePastDrives=true
) => {
  const res = await api.get(
    `/Drive/member/fetch/all?driveId=${driveId}&role=${roleName}&includePastDrives=${includePastDrives}`
  );
  return res.data.data;
};

export const addDriveMember = async (payload: {
  driveId: number;
  memberId: number;
  memberRole: string;
}) => {
  return api.post("/Drive/member/add", payload);
};

export const removeDriveMember = async (payload: {
  driveId: number;
  memberId: number;
}) => {
  return await api.delete("/drive/member/remove", {
    data: payload, // 👈 IMPORTANT for DELETE
  });
};


// GET candidates already added to drive
export const getDriveCandidates = async (driveId: number,includePastDrives=true) => {
  return await api.get(`/drive/candidate/fetch/all?driveId=${driveId}&includePastDrives=${includePastDrives}`);
};

// ADD candidates to drive
export const addDriveCandidates = async (payload: {
  driveId: number;
  candidateIds: number[];
}) => {
  console.log("ADD DRIVE CANDIDATES PAYLOAD:", payload);

  return await api.post("/drive/candidates/add", payload);
};


// REMOVE candidates from drive
export const removeDriveCandidates = async (payload: {
  driveId: number;
  candidateIds: number[];
}) => {
  return await api.delete("/drive/candidates/remove", {data:payload});
};


export const CandidateService = {
  addCandidate(payload: AddCandidateRequest) {
    return api.post("/Candidate/add", payload);
  },
};

export const getAllMentorCandidates = async (): Promise<MentorCandidate[]> => {
  const response = await api.get<{ data: MentorCandidate[] }>(
    "/Candidate/fetch/all"
  );

  return response.data.data; // ✅ return the array only
};

export const getAllCandidatesAssignedMentor = async (mentorId:number) => {
  return await api.get(`/User/fetchCandidatesDetail/${mentorId}`);
};

export const getPanelAssignedCandidates = async (): Promise<MentorCandidate[]> => {
  const response = await api.get<any>(
    "/Candidate/panelmember/assignedcandidates"
  );

  const payload =
    response.data?.data?.data ?? // Response<Response<List<T>>>
    response.data?.data ??       // Response<List<T>>
    response.data ??             // Plain List<T>
    [];

  return Array.isArray(payload) ? payload : [];
};

// Services/User.Service.ts
export const postMarkAttendance = async (
  payload: CandidateAttendanceMentorDto
) => {
  return api.post("/Candidate/candidate/mark-attendance", payload);
};


