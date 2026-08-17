import { supabase } from "../lib/supabase";

export interface Message {
  id: string;
  request_id: string;
  author_id: string;
  content: string;
  type: "customer" | "internal";
  created_at: string;
}

export const getRequestMessages = async (requestId: string) => {
  return await supabase
    .from("messages")
    .select("id, request_id, author_id, content, type, created_at")
    .eq("request_id", requestId)
    .order("created_at", { ascending: true });
};
