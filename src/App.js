import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";

const ProtectedRoute = lazy(() => import("./component/ProtectedRoute.js"));
const Home = lazy(() => import("./pages/Home.js"));
const QuestionForm = lazy(() => import("./component/QuestionForm.js"));
const Event = lazy(() => import("./pages/Events.js"));
const ResetPassword = lazy(() => import("./features/auth/ResetPassword.js"));
const AdminLogin = lazy(() => import("./pages/AdminLoginPage.js"));
const ClientLoginPage = lazy(() => import("./pages/ClientLoginPage.js"));
const QuizTimer = lazy(() => import("./features/quiz/components/QuizTimer.js"));
const RegisterPage = lazy(() => import("./pages/RegisterPage.js"));
const ShowQuestion = lazy(() => import("./features/quiz/ShowQuestions.js"));
const NotLogin = lazy(() => import("./component/NotLogin.js"));
const CreateQuiz = lazy(() => import("./features/quiz/CreateQuiz.js"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.js"));
const AboutUs = lazy(() => import("./pages/AboutUs.js"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmailPage.js"));
const ShowMarks = lazy(() => import("./features/quiz/ShowMarks.js"));
const ManageAccountPage = lazy(() => import("./pages/ManageAccountPage.js"));

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
];

const clientProtectedRoutes = [
  { path: "/quiz-timer", element: <QuizTimer /> },
  { path: "/show-question", element: <ShowQuestion /> },
];

const adminProtectedRoutes = [
  { path: "/admin-dashboard", element: <AdminDashboard /> },
  { path: "/create-quiz", element: <CreateQuiz /> }, // Formerly organizer route
  { path: "/question-form", element: <QuestionForm /> },
  { path: "/show-marks", element: <ShowMarks /> },
];

const sharedProtectedRoutes = [
  { path: "/manage-account", element: <ManageAccountPage /> },
];

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-screen">
              Loading...
            </div>
          }
        >
          <Routes>
            {/* Public Routes */}
            {publicRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}

            {/* Client Protected Routes */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={["user"]}
                  loginPath="/client-login"
                />
              }
            >
              {clientProtectedRoutes.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}
            </Route>

            {/* Admin Protected Routes */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={["admin"]}
                  loginPath="/admin-login"
                />
              }
            >
              {adminProtectedRoutes.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}
            </Route>

            {/* Shared Protected Routes (Accessible by any of the specified roles) */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={["user", "admin"]} // Removed "organizer"
                  loginPath="/client-login"
                />
              }
            >
              {sharedProtectedRoutes.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}
            </Route>

            {/* Fallback for unmatched routes */}
            <Route
              path="*"
              element={
                <p className="text-white text-center text-3xl h-screen flex items-center justify-center">
                  Page Not Found (404)
                </p>
              }
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}
