import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { ClientLayout } from '../layouts/ClientLayout';
import { FreelancerLayout } from '../layouts/FreelancerLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// Public Pages
import { Home } from '../pages/Home/Home';
import { Login } from '../pages/Auth/Login';
import { Register } from '../pages/Auth/Register';
import { ForgotPassword } from '../pages/Auth/ForgotPassword';
import { BrowseProjects } from '../pages/Freelancer/BrowseProjects';
import { FreelancersDirectory } from '../pages/Freelancer/FreelancersDirectory';
import { SubmitProposal } from '../pages/Freelancer/SubmitProposal';
import { Profile } from '../pages/Profile/Profile';
import { EditProfile } from '../pages/Profile/EditProfile';
import { Messages } from '../pages/Messages/Messages';
import { Transactions } from '../pages/Payments/Transactions';

// Client Pages
import { ClientDashboard } from '../pages/Client/ClientDashboard';
import { PostProject } from '../pages/Client/PostProject';
import { MyProjects } from '../pages/Client/MyProjects';
import { ProjectDetails } from '../pages/Client/ProjectDetails';
import { Contracts } from '../pages/Client/Contracts';

// Freelancer Pages
import { FreelancerDashboard } from '../pages/Freelancer/FreelancerDashboard';
import { MyProposals } from '../pages/Freelancer/MyProposals';
import { Earnings } from '../pages/Freelancer/Earnings';

// Admin Pages
import { AdminDashboard } from '../pages/Admin/Dashboard';
import { AdminUsers } from '../pages/Admin/Users';
import { AdminProjects } from '../pages/Admin/Projects';

// Guards
import { ProtectedRoute } from '../components/ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/browse" element={<BrowseProjects />} />
      <Route path="/freelancers" element={<FreelancersDirectory />} />
      <Route path="/projects/:id" element={<SubmitProposal />} />
      <Route path="/profile/:id" element={<Profile />} />

      {/* Shared Authenticated Pages */}
      <Route
        path="/profile/edit"
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payments/transactions"
        element={
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        }
      />

      {/* Client Routes */}
      <Route
        path="/client"
        element={
          <ProtectedRoute allowedRoles={['CLIENT', 'ADMIN']}>
            <ClientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/client/dashboard" replace />} />
        <Route path="dashboard" element={<ClientDashboard />} />
        <Route path="post-project" element={<PostProject />} />
        <Route path="my-projects" element={<MyProjects />} />
        <Route path="projects/:id" element={<ProjectDetails />} />
        <Route path="contracts" element={<Contracts />} />
      </Route>

      {/* Freelancer Routes */}
      <Route
        path="/freelancer"
        element={
          <ProtectedRoute allowedRoles={['FREELANCER', 'ADMIN']}>
            <FreelancerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/freelancer/dashboard" replace />} />
        <Route path="dashboard" element={<FreelancerDashboard />} />
        <Route path="my-proposals" element={<MyProposals />} />
        <Route path="earnings" element={<Earnings />} />
        <Route path="contracts" element={<Earnings />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="projects" element={<AdminProjects />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
