/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Work } from "./pages/Work";
import { ProjectDetail } from "./pages/ProjectDetail";
import { Lab } from "./pages/Lab";
import { Journey } from "./pages/Journey";
import { Credentials } from "./pages/Credentials";
import { Media } from "./pages/Media";
import { Now } from "./pages/Now";
import { About } from "./pages/About";
import { Connect } from "./pages/Connect";
import { NotFound } from "./pages/NotFound";
import { AdminLayout } from "./admin/AdminLayout";
import { AdminLogin } from "./admin/AdminLogin";
import { AdminDashboard } from "./admin/AdminDashboard";
import { AdminProfile } from "./admin/AdminProfile";
import { AdminProjects } from "./admin/AdminProjects";
import { AdminPosts } from "./admin/AdminPosts";
import { AdminCredentials } from "./admin/AdminCredentials";
import { AdminJourney } from "./admin/AdminJourney";
import { AdminBeyondCode } from "./admin/AdminBeyondCode";
import { AdminEntities } from "./admin/AdminEntities";
import { useStore } from "./store/useStore";
import { useAuthStore } from "./store/useAuthStore";

export default function App() {
  const initStore = useStore(state => state.init);
  const initAuth = useAuthStore(state => state.init);
  const isAdmin = useAuthStore(state => state.isAdmin);
  const loading = useAuthStore(state => state.loading);

  useEffect(() => {
    initStore();
    initAuth();
  }, [initStore, initAuth]);

  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={loading ? null : isAdmin ? <AdminLayout /> : <Navigate to="/admin/login" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="posts" element={<AdminPosts />} />
          <Route path="credentials" element={<AdminCredentials />} />
          <Route path="journey" element={<AdminJourney />} />
          <Route path="beyond-code" element={<AdminBeyondCode />} />
          <Route path="entities" element={<AdminEntities />} />
        </Route>

        {/* Public Routes */}
        <Route path="*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/work" element={<Work />} />
              <Route path="/work/:slug" element={<ProjectDetail />} />
              <Route path="/lab" element={<Lab />} />
              <Route path="/journey" element={<Journey />} />
              <Route path="/credentials" element={<Credentials />} />
              <Route path="/media" element={<Media />} />
              <Route path="/now" element={<Now />} />
              <Route path="/beyond-code" element={<Now />} />
              <Route path="/about" element={<About />} />
              <Route path="/connect" element={<Connect />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}
