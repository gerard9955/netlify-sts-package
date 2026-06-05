import { getTopicsStore, json, readJson, requireAdmin } from "./shared.mjs";

export default async function handler(request) {
  if (request.method !== "POST") return json({ ok: false, error: "Method not allowed." }, 405);

  const data = await readJson(request);
  if (!requireAdmin(data)) return json({ ok: false, error: "Unauthorized admin request." }, 403);

  const id = String(data.id || "").trim();
  if (!id) return json({ ok: false, error: "Missing topic id." }, 400);

  try {
    const store = await getTopicsStore();
    await store.save(store.topics.filter((topic) => topic.id !== id));
    return json({ ok: true });
  } catch {
    return json({ ok: false, error: "Could not delete topic." }, 500);
  }
}
