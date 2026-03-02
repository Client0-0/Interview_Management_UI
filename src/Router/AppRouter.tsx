import { createBrowserRouter, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "./ProtectedRoute";
import PageLoader from "./PageLoader";
import RootLayout from "./RootLayout";
//import AddHRModal from "../Components/Admin/AddDashBoardComponents/AddHrModel";
import AddUserModal from "../Components/Admin/AddDashBoardComponents/AddUserModal";
import UserView from "../Components/Admin/View/UserView";
import DriveView from "../Components/Admin/View/DriveView/DriveView";
import DriveInfo from "../Components/Admin/View/DriveView/DriveInfo";
import DriveCandidates from "../Components/Admin/View/DriveView/ChildDriveMember/DriveCandidates";
import DriveConfig from "../Components/Admin/View/DriveView/DriveConfig";
import DriveMembers from "../Components/Admin/View/DriveView/DriveMembers";
import DriveHR from "../Components/Admin/View/DriveView/ChildDriveMember/DriveHr";
import DriveMentor from "../Components/Admin/View/DriveView/ChildDriveMember/DriveMentor";
import DrivePanel from "../Components/Admin/View/DriveView/ChildDriveMember/DrivePanel";
import DriveViewMember from "../Components/Admin/View/DriveView/ChildDriveMember/DriveViewMember";
import DriveViewCandidate from "../Components/Admin/View/DriveView/ChildDriveMember/DriveViewCandidate";
import DriveWizard from "../Components/Admin/DashBoardComponents/CreateDriveWizard";
import DeactivateUserRoute from "../Components/Admin/Edit/DeactivateRoute";
import EditUserRoute from "../Components/Admin/Edit/EditUserRoute";
import AddPanelModal from "../Components/Admin/AddDashBoardComponents/AddPanelModal";
import AddHRModal from "../Components/Admin/AddDashBoardComponents/AddHrModel";
import AddMentorModal from "../Components/Admin/AddDashBoardComponents/AddMentorModel";
import AddCandidateModal from "../Components/Admin/AddDashBoardComponents/AddCandidateModal";
import CandidateView from "../Components/Admin/View/CandidateView";
import CandidateEditRoute from "../Components/Admin/Edit/CandidateEditRoute";
import AddCandidate from "../Components/Admin/AddDashBoardComponents/AddCandidate";
import AttendanceManagement from "../Components/MentorDashboard/AttendanceManagement";
import Availability from "../Components/MentorDashboard/Availability";
import ReassignPage from "../Components/PanelDashboard/ReassignPage";
import BulkUploadCandidates from "../Components/Admin/DashBoardComponents/BulkUploadCandidates";
//import ReassignPage from "../Components/PanelDashboard/ReassignPage";

/* PUBLIC */
const Login = lazy(() => import("../Components/Login/Login"));
const Signup = lazy(() => import("../Components/Signup"));
const ForgotPassword = lazy(() => import("../Components/ForgetPassword/ForgotPassword"));
const ChangePasswordPage = lazy(() => import("../Components/ChangePassword/ChangePasswordPage"));

/* ADMIN */
const AdminLayout = lazy(() => import("../Components/Admin/Layout/AdminLayout"));
const AdminDashboard = lazy(() => import("../Components/Admin/DashBoardComponents/Dashboard"));
const Users = lazy(() => import("../Components/Admin/DashBoardComponents/Users"));
const Candidates = lazy(() => import("../Components/Admin/DashBoardComponents/Candidates"));
const Panels = lazy(() => import("../Components/Admin/DashBoardComponents/Panels"));
const Mentors = lazy(() => import("../Components/Admin/DashBoardComponents/Mentor"));
const HR = lazy(() => import("../Components/Admin/DashBoardComponents/Hr"));
const Drives = lazy(() => import("../Components/Admin/DashBoardComponents/Drive"));

/* HR */
const HRLayout = lazy(() => import("../Components/HRDashboard/Layout/HRLayout"));
const HRDashboard = lazy(() => import("../Components/HRDashboard/HRDashBoard"));
const CandidatesToday = lazy(() => import("../Components/HRDashboard/CandidatesToday"));
const CandidateManagement = lazy(() => import("../Components/HRDashboard/CandidateManagement"));
const HRBulkUpload = lazy(() => import("../Components/HRDashboard/HRBulkUpload"));
const HRCandidateDetails = lazy(() => import("../Components/HRDashboard/HRCandidateDetails"));

/* MENTOR */
const MentorLayout = lazy(() => import("../Components/MentorDashboard/Layout/MentorLayout"));
const MentorDashboard = lazy(() => import("../Components/MentorDashboard/MentorDashboard"));
//const Attendance = lazy(() => import("../Components/MentorDashboard/AttendanceManagement"));
const InterviewFeedback = lazy(() => import("../Components/PanelDashboard/InterviewFeedback"));
const MentorCandidateDetails = lazy(() => import("../Components/MentorDashboard/MentorCandidateDetails"));

/* PANEL */
const PanelLayout = lazy(() => import("../Components/PanelDashboard/Layout/PanelLayout"));
const PanelDashboard = lazy(() => import("../Components/PanelDashboard/PanelDashboard"));
const Reassign = lazy(() => import("../Components/PanelDashboard/ReassignPage"));
const SetAvailability = lazy(() => import("../Components/PanelDashboard/SetAvailability"));
const PanelCandidateDetails = lazy(() => import("../Components/PanelDashboard/PanelCandidateDetails"));

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Navigate to="/login" replace /> },

      {
        path: "/login",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: "/signup",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Signup />
          </Suspense>
        ),
      },
      {
        path: "/forgot-password",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ForgotPassword />
          </Suspense>
        ),
      },
      {
        path: "/change-password",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ChangePasswordPage />
          </Suspense>
        ),
      },

      /* ================= ADMIN ================= */
      {
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
          {
            path: "/admin",
            element: (
              <Suspense fallback={<PageLoader />}>
                <AdminLayout />
              </Suspense>
            ),
            children: [
              { index: true, element: <Navigate to="dashboard" replace /> },
              { path: "dashboard", element: <AdminDashboard /> },

              {
                path: "users",
                element: <Users />,          // 👈 parent
                children: [
                  { path: "adduser", element: <AddUserModal /> }, // 👈 modal route
                  { path: "viewuser", element: <UserView /> },
                  { path: "edituser/:userId", element: <EditUserRoute /> },
                  {
                    path: "deactivateuser/:userId",
                    element: <DeactivateUserRoute />,
                  }
                ],
              },

              {
                path: "candidates",
                element: <Candidates />,
                children: [
                  { path: "addcandidate", element: <AddCandidateModal /> },
                  { path: "viewcandidate", element: <CandidateView /> },
                  { path: "editcandidate/:candidateId", element: <CandidateEditRoute /> },
                  { path: "bulkupload", element: <BulkUploadCandidates onBack={() => window.history.back()} /> }
                ],
              },
              {
                path: "panels",
                element: <Panels />,
                children: [
                  { path: "addpanel", element: <AddPanelModal /> },
                  { path: "viewuser", element: <UserView /> },
                  { path: "edituser/:userId", element: <EditUserRoute /> },
                  { path: "deactivateuser/:userId", element: <DeactivateUserRoute /> }
                ],
              },
              {
                path: "mentors",
                element: <Mentors />,
                children: [
                  { path: "addmentor", element: <AddMentorModal /> }, // 👈 modal route
                  { path: "viewuser", element: <UserView /> },
                  { path: "edituser/:userId", element: <EditUserRoute /> },
                  {
                    path: "deactivateuser/:userId",
                    element: <DeactivateUserRoute />,
                  }
                ],
              },
              {
                path: "hr",
                element: <HR />,
                children: [
                  { path: "addhr", element: <AddHRModal /> }, // 👈 modal route
                  { path: "viewuser", element: <UserView /> },
                  { path: "edituser/:userId", element: <EditUserRoute /> },
                  {
                    path: "deactivateuser/:userId",
                    element: <DeactivateUserRoute />,
                  }
                ],
              },

              {
                path: "drives",
                element: <Drives />,
                children: [
                  {
                    path: "createdrive",
                    element: <DriveWizard onClose={() => window.history.back()} />,
                  },

                  {
                    path: "view/:id",
                    element: <DriveView mode="view" />,
                    children: [
                      { index: true, element: <DriveInfo /> }, // default
                      { path: "addcandidate", element: <AddCandidate /> },
                      { path: "driveinfo", element: <DriveInfo /> },
                      {
                        path: "members",
                        element: <DriveMembers />,
                        children: [
                          { index: true, element: <Navigate to="drivehr" replace /> },
                          {
                            path: "drivehr",
                            element: <DriveHR />,
                            children: [

                              {
                                path: "view/:userId",   // 👈 modal route
                                element: <DriveViewMember />,
                              },
                            ],
                          },
                          {
                            path: "drivementor",
                            element: <DriveMentor />,
                            children: [

                              {
                                path: "view/:userId",   // 👈 modal route
                                element: <DriveViewMember />,
                              },
                            ],
                          },
                          {
                            path: "drivepanel",
                            element: <DrivePanel />,
                            children: [

                              {
                                path: "view/:userId",   // 👈 modal route
                                element: <DriveViewMember />,
                              },
                            ],
                          },
                        ],
                      },

                      { path: "config", element: <DriveConfig /> },
                      {
                        path: "candidates",
                        element: <DriveCandidates />,
                        children: [
                          {
                            path: "viewcandidate/:candidateId",
                            element: <DriveViewCandidate />,
                          },
                        ],
                      },

                    ],
                  },
                  {
                    path: "edit/:id",
                    element: <DriveView mode="edit" />,
                    children: [
                      { index: true, element: <DriveInfo /> }, // default
                      { path: "driveinfo", element: <DriveInfo /> },
                      {
                        path: "members",
                        element: <DriveMembers />,
                        children: [
                          { index: true, element: <Navigate to="drivehr" replace /> },
                          {
                            path: "drivehr",
                            element: <DriveHR />,
                            children: [

                              {
                                path: "view/:userId",   // 👈 modal route
                                element: <DriveViewMember />,
                              },
                            ],
                          },
                          {
                            path: "drivementor",
                            element: <DriveMentor />,
                            children: [

                              {
                                path: "view/:userId",   // 👈 modal route
                                element: <DriveViewMember />,
                              },
                            ],
                          },
                          {
                            path: "drivepanel",
                            element: <DrivePanel />,
                            children: [

                              {
                                path: "view/:userId",   // 👈 modal route
                                element: <DriveViewMember />,
                              },
                            ],
                          },
                        ],
                      },
                      { path: "config", element: <DriveConfig /> },
                      {
                        path: "candidates",
                        element: <DriveCandidates />,
                        children: [
                          {
                            path: "viewcandidate/:candidateId",
                            element: <DriveViewCandidate />,
                          },
                        ],
                      },

                    ],
                  },
                  { path: "viewuser", element: <UserView /> },
                ],

              },
            ],
          },
        ],
      },

      /* ================= HR ================= */
      {
        element: <ProtectedRoute allowedRoles={["hr"]} />,
        children: [
          {
            path: "/hr",
            element: <HRLayout />,
            children: [
              { index: true, element: <HRDashboard /> },
              {
                path: "candidates",
                element: <CandidatesToday />,
                children: [
                  { path: "details/:candidateId", element: <HRCandidateDetails /> },
                ],
              },
              {
                path: "candidatemanagement",
                element: <CandidateManagement />,
                children: [
                  { path: "bulkupload", element: <HRBulkUpload /> },
                  { path: "details/:candidateId", element: <HRCandidateDetails /> },
                ],
              },
            ],
          },
        ],
      },

      /* ================= MENTOR ================= */
      {
        element: <ProtectedRoute allowedRoles={["mentor"]} />,
        children: [
          {
            path: "/mentor",
            element: <MentorLayout />,
            children: [
              { index: true, element: <MentorDashboard /> },

              {
                path: "attendance",
                element: <AttendanceManagement />,
              },
              {
                path: "availability",
                element: <Availability />,
              },
              {
                path: "reassignpanel/:candidateId",
                element: <ReassignPage />,
              },
              {
                path: "interviewfeedback",
                element: <InterviewFeedback />,
              },
              {
                path: "details/:candidateId",
                element: <MentorCandidateDetails />,
              },
            ],
          },
        ],
      },

      /* ================= PANEL ================= */
      {
        element: <ProtectedRoute allowedRoles={["panel"]} />,
        children: [
          {
            path: "/panel",
            element: <PanelLayout />,
            children: [
              { index: true, element: <PanelDashboard /> },
              { path: "reassign/:candidateId", element: <Reassign /> },
              { path: "setavailability", element: <SetAvailability /> },
              { path: "interviewfeedback", element: <InterviewFeedback /> },
              { path: "details/:candidateId", element: <PanelCandidateDetails /> },
            ],
          },
        ],
      },
    ],
  },
]);
