import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

const Home = lazy(() => import("./pages/Home.js"));
const QuestionForm = lazy(() => import("./component/QuestionForm.js"));
const Event = lazy(() => import("./pages/Events.js"));
const ResetPassword = lazy(() => import("./features/auth/ResetPassword.js"));
const EnterNewPassword = lazy(() =>
  import("./features/auth/EnterNewPassword.js")
);
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

const routes = [
  { path: "/", element: <Home /> },
  { path: "/question-form", element: <QuestionForm /> },
  { path: "/event", element: <Event /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/enter-new-password", element: <EnterNewPassword /> },
  { path: "/admin-login", element: <AdminLogin /> },
  { path: "/client-login", element: <ClientLoginPage /> },
  { path: "/quiz-timer", element: <QuizTimer /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/show-question", element: <ShowQestion /> },
  { path: "/aboutus", element: <AboutUs /> },
  { path: "/verify-email/:token", element: <VerifyEmail /> },
  { path: "/show-marks", element: <ShowMarks /> },
  { path: "/notlogin", element: <NotLogin /> },
  { path: "/create-quiz", element: <CreateQuiz /> },
  { path: "/admin-dashboard", element: <AdminDashboard /> },
];

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Suspense fallback={null}>
          <Routes>
            {routes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}
