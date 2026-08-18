import "./App.css";

import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import type { Session } from "@supabase/supabase-js";

import { supabase } from "./lib/supabase";
import { getCurrentSession } from "./services/authService";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import RequestsPage from "./pages/RequestsPage/RequestsPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import CreateRequestPage from "./pages/CreateRequestPage/CreateRequestPage";
import RequestDetailsPage from "./pages/RequestDetailsPage/RequestDetailsPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import ThemeToggle from "./components/theme-toggle/ThemeToggle";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const { data } = await getCurrentSession();

      setSession(data.session);
      setLoading(false);
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <p>Checking authentication...</p>;
  }

  return (
    <>
      <ThemeToggle />
      <div className="app-content">
        <Routes>
          <Route
            path="/"
            element={<Navigate to={session ? "/requests" : "/login"} replace />}
          />

          <Route
            path="/login"
            element={
              session ? <Navigate to="/requests" replace /> : <LoginPage />
            }
          />

          <Route
            path="/signup"
            element={
              session ? <Navigate to="/requests" replace /> : <SignupPage />
            }
          />

          <Route element={<ProtectedRoute session={session} />}>
            <Route
              path="/requests"
              element={<RequestsPage session={session} />}
            />
            <Route path="/requests/create" element={<CreateRequestPage />} />
            <Route path="/requests/:id" element={<RequestDetailsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </>
  );
}
