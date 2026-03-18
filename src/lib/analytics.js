import { supabase } from "./supabase";

export async function trackVisit() {
  if (sessionStorage.getItem("qa_visited")) return;
  try {
    await supabase.from("page_views").insert({});
    sessionStorage.setItem("qa_visited", "1");
  } catch (err) {
    console.warn("Could not track visit:", err);
  }
}

export async function getVisitorCount() {
  try {
    const { count, error } = await supabase
      .from("page_views")
      .select("*", { count: "exact", head: true });
    if (error) throw error;
    return count ?? 0;
  } catch (err) {
    console.warn("Could not fetch visitor count:", err);
    return null;
  }
}
