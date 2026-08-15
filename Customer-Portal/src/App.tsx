import { useEffect, useState } from "react";
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'

import type { Session } from "@supabase/supabase-js";

import { supabase } from "./lib/supabase";
import { signOut, getCurrentSession } from "./services/authService";

import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";

type AuthMode = "login" | "signup";

export default function App() {
  console.log("Supabase client:", supabase);

  const [session, setSession] = useState<Session | null>(null);

  const [authMode, setAuthMode] = useState<AuthMode>("login");

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

  const handleLogout = async () => {
    await signOut();
  };

  if (loading) {
    return <p>Checking authentication...</p>;
  }

  if (session) {
    return (
      <div>
        <h1>Welcome to Customer Portal</h1>

        <p>Logged in as: {session.user.email}</p>

        <button onClick={handleLogout}>Sign Out</button>
      </div>
    );
  }

  if (authMode === "login") {
    return (
      <Login
        onSuccess={() => {}}
        onSwitchToSignup={() => setAuthMode("signup")}
      />
    );
  }

  return (
    <Signup onSuccess={() => {}} onSwitchToLogin={() => setAuthMode("login")} />
  );
}
