import { getTopicsStore, json, sortTopics } from "./shared.mjs";

export default async function handler() {
  try {
    const { topics } = await getTopicsStore();
    return json(sortTopics(topics));
  } catch {
    return json({ ok: false, error: "Could not load topics." }, 500);
  }
}
