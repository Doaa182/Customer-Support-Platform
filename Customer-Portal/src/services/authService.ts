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
