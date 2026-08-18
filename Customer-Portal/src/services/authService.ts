import { supabase } from "../lib/supabase";

export const signUp = async (name: string, email: string, password: string) => {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role: "customer",
      },
    },
  });
};

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentSession = async () => {
  return await supabase.auth.getSession();
};

export const getCurrentUserProfile = async () => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      profile: null,
      error: userError ?? new Error("User is not authenticated."),
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, name, role")
    .eq("id", user.id)
    .single();

  return {
    profile,
    error: profileError,
  };
};
