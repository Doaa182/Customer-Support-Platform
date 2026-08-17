import { supabase } from "../lib/supabase";

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
