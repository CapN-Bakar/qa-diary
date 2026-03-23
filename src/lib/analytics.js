import { supabase } from "./supabase";

export async function trackVisit() {
  if (sessionStorage.getItem("qa_visited")) return;
  try {
    const today = new Date().toISOString().slice(0, 10);
    await supabase.from("page_views").insert({ visit_date: today });
    sessionStorage.setItem("qa_visited", "1");
  } catch (err) {
    console.warn("Could not track visit:", err);
  }
}

export async function getVisitorStats() {
  try {
    const today = new Date().toISOString().slice(0, 10);

    const [totalRes, todayRes] = await Promise.all([
      supabase.from("page_views").select("*", { count: "exact", head: true }),
      supabase
        .from("page_views")
        .select("*", { count: "exact", head: true })
        .eq("visit_date", today),
    ]);

    return {
      total: totalRes.count ?? 0,
      today: todayRes.count ?? 0,
    };
  } catch (err) {
    console.warn("Could not fetch visitor stats:", err);
    return { total: null, today: null };
  }
}
