import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isValidHttpUrl = (value: string) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const hasValidSupabaseConfig =
  Boolean(supabaseUrl) &&
  Boolean(supabaseAnonKey) &&
  isValidHttpUrl(supabaseUrl as string);

export const supabase = hasValidSupabaseConfig
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null;

export const assertSupabase = () => {
  if (!supabase) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase environment variables.");
    }

    throw new Error(
      "Invalid Supabase configuration: NEXT_PUBLIC_SUPABASE_URL must be a full http(s) URL.",
    );
  }

  return supabase;
};
