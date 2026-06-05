import { getTopicsStore, json, normalizeTopic, readJson, requireAdmin, validateTopic } from "./shared.mjs";

export default async function handler(request) {
  if (request.method !== "POST") return json({ ok: false, error: "Method not allowed." }, 405);

  const data = await readJson(request);
  if (!requireAdmin(data)) return json({ ok: false, error: "Unauthorized admin request." }, 403);

  const error = validateTopic(data.topic);
  if (error) return json({ ok: false, error }, 400);

  try {
    const topic = normalizeTopic(data.topic);
    const store = await getTopicsStore();
    const withoutExisting = store.topics.filter((item) => item.id !== topic.id);
    await store.save([...withoutExisting, topic]);
    return json({ ok: true, topic });
  } catch {
    return json({ ok: false, error: "Could not save topic." }, 500);
  }
}
