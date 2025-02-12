import React from "react";

// Admin Imports
import AdminDashboard from "views/admin/default";
import Profile from "views/admin/profile";
import DataTables from "views/admin/tables";

// Auth Imports
import SignIn from "views/auth/SignIn";
import Register from "views/auth/Registration";

// User Imports
import MainDashboard from "views/user/default";
import UserProfile from "views/user/profile";
import UserDataTables from "views/user/tables";
import AddTimesheetForm from "views/user/tables/components/AddTimeSheetForm";
import TimesheetView from "views/user/tables/components/ViewTimeSheetForm";
import EditTimesheet from "views/user/tables/components/EditTimeSheetForm";

// Icon Imports
import {
  MdHome,
  MdBarChart,
  MdPerson,
  MdLock,
  MdAddTask,
  MdViewTimeline,
  MdEditNote,
} from "react-icons/md";

// Routes khusus Admin
export const adminRoutes = [
  {
    name: "Admin Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <AdminDashboard />,
    showInSidebar: true,
  },
  {
    name: "Timesheet Data",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "data-tables",
    component: <DataTables />,
    showInSidebar: true,
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile />,
    showInSidebar: false,
  },
];

// Routes khusus User
export const userRoutes = [
  {
    name: "Main Dashboard",
    layout: "/user",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
    showInSidebar: true,
  },
  {
    name: "Timesheet Data",
    layout: "/user",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "data-tables",
    component: <UserDataTables />,
    showInSidebar: true,
  },
  {
    name: "Profile",
    layout: "/user",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <UserProfile />,
    showInSidebar: false,
  },
  {
    name: "Add Timesheet",
    layout: "/user",
    path: "add-timesheet",
    icon: <MdAddTask className="h-6 w-6" />,
    component: <AddTimesheetForm />,
    showInSidebar: false,
  },
  {
    name: "View Timesheet",
    layout: "/user",
    path: "view-timesheet/:id",
    icon: <MdViewTimeline className="h-6 w-6" />,
    component: <TimesheetView />,
    showInSidebar: false,
  },
  {
    name: "Edit Timesheet",
    layout: "/user",
    path: "edit-timesheet/:id",
    icon: <MdEditNote className="h-6 w-6" />,
    component: <EditTimesheet />,
    showInSidebar: false,
  },
];

// Routes untuk autentikasi
export const authRoutes = [
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
    showInSidebar: false,
  },
  {
    name: "Register",
    layout: "/auth",
    path: "register",
    icon: <MdLock className="h-6 w-6" />,
    component: <Register />,
    showInSidebar: false,
  },
];

export default { adminRoutes, userRoutes, authRoutes };
