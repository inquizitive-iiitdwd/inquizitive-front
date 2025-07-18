import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";

const ProtectedRoute = lazy(() => import("./component/ProtectedRoute.js"));

// --- Import all your pages ---
const Home = lazy(() => import("./pages/Home.js"));
const QuestionForm = lazy(() => import("./component/QuestionForm.js"));
const Event = lazy(() => import("./pages/Events.js"));
const ResetPassword = lazy(() => import("./features/auth/ResetPassword.js"));
const AdminLogin = lazy(() => import("./pages/AdminLoginPage.js"));
const ClientLoginPage = lazy(() => import("./pages/ClientLoginPage.js"));
const QuizTimer = lazy(() => import("./features/quiz/components/QuizTimer.js"));
const RegisterPage = lazy(() => import("./pages/RegisterPage.js"));
const ShowQestion = lazy(() => import("./features/quiz/ShowQuestions.js"));
const NotLogin = lazy(() => import("./component/NotLogin.js"));
const CreateQuiz = lazy(() => import("./features/quiz/CreateQuiz.js"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.js"));
const AboutUs = lazy(() => import("./pages/AboutUs.js"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmailPage.js"));
const ShowMarks = lazy(() => import("./features/quiz/ShowMarks.js"));
const ManageAccountPage = lazy(() => import("./pages/ManageAccountPage.js"));
const OrganizerLogin = lazy(() => import("./pages/OrganizerLoginPage.js"));


const publicRoutes = [
  { path: "/", element: <Home /> },
  { path: "/event", element: <Event /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/reset-password/:token", element: <ResetPassword /> },
  { path: "/admin-login", element: <AdminLogin /> },
  { path: "/client-login", element: <ClientLoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/aboutus", element: <AboutUs /> },
  { path: "/verify-email/:token", element: <VerifyEmail /> },
  { path: "/notlogin", element: <NotLogin /> },
  { path: "/organizer-login", element: <OrganizerLogin /> },
];

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
          <Routes>
            {/* Public Routes */}
            {publicRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}

            {/* Organizer Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['organizer']} loginPath="/organizer-login" />}> {/* ADDED loginPath */}
              <Route path="/create-quiz" element={<CreateQuiz />} />
              <Route path="/question-form" element={<QuestionForm />} />
              <Route path="/show-marks" element={<ShowMarks />} />
              {/* Add other organizer-specific routes here */}
            </Route>

            {/* Client Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['client']} loginPath="/client-login" />}> {/* ADDED loginPath */}
              <Route path="/quiz-timer" element={<QuizTimer />} />
              <Route path="/show-question" element={<ShowQestion />} />
              <Route path="/manage-account" element={<ManageAccountPage />} />
              {/* Add other client-specific routes here */}
            </Route>

            {/* Admin Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} loginPath="/admin-login" />}> {/* ADDED loginPath */}
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              {/* Add other admin-specific routes here */}
            </Route>

            {/* Fallback for unmatched routes */}
            <Route path="*" element={<p className="text-white text-center text-3xl h-screen flex items-center justify-center">Page Not Found (404)</p>} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}