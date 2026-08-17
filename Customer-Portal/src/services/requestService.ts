import { supabase } from "../lib/supabase";

export interface Request {
  id: string;
  reference: string;
  description: string;
  category: string;
  urgency: "low" | "medium" | "high";
  status:
    | "open"
    | "in_progress"
    | "waiting_for_customer"
    | "resolved"
    | "closed";
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  assigned_agent_id: string | null;
}

interface CreateRequestData {
  reference: string;
  description: string;
  category: string;
  urgency: "low" | "medium" | "high";
}

export const createRequest = async ({
  reference,
  description,
  category,
  urgency,
}: CreateRequestData) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User is not authenticated");
  }

  return await supabase.from("requests").insert({
    reference,
    customer_id: user.id,
    description,
    category,
    urgency,
  });
};

export const getMyRequests = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User is not authenticated");
  }

  return await supabase
    .from("requests")
    .select(
      "id, reference, description, category, urgency, status, created_at, updated_at, resolved_at, assigned_agent_id",
    )
    .eq("customer_id", user.id)
    .order("updated_at", { ascending: false });
};
