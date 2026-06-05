import { getStore } from "@netlify/blobs";
import { createHash, timingSafeEqual } from "node:crypto";

const ADMIN_CODE_HASH = "5d24913db8cb189a30b29a670343175bb9e90c71f38e2c4c162974cf89e94538";
const ALLOWED_PARENTS = new Set(["ai", "bio", "climate", "digital"]);

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export function requireAdmin(data) {
  const code = String(data?.adminCode || "");
  const provided = createHash("sha256").update(code).digest("hex");
  const a = Buffer.from(provided, "hex");
  const b = Buffer.from(ADMIN_CODE_HASH, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

export function validateTopic(topic) {
  if (!topic || typeof topic !== "object") return "Missing topic data.";
  for (const field of ["id", "parent", "title", "desc", "overview"]) {
    if (!String(topic[field] || "").trim()) return `Missing required field: ${field}.`;
  }
  if (!ALLOWED_PARENTS.has(String(topic.parent))) return "Invalid parent topic.";
  return "";
}

export function normalizeTopic(topic) {
  return {
    id: String(topic.id),
    parent: String(topic.parent),
    icon: String(topic.icon || "*"),
    title: String(topic.title),
    desc: String(topic.desc),
    author: String(topic.author || ""),
    date: String(topic.date || ""),
    overview: String(topic.overview),
    overview2: String(topic.overview2 || ""),
    keyPoints: Array.isArray(topic.keyPoints) ? topic.keyPoints : [],
    thinkers: Array.isArray(topic.thinkers) ? topic.thinkers : [],
    implications: String(topic.implications || ""),
  };
}

export async function getTopicsStore() {
  const store = getStore("sts-subtopics");
  const topics = (await store.get("published", { type: "json" })) || [];
  return {
    topics: Array.isArray(topics) ? topics : [],
    async save(nextTopics) {
      await store.setJSON("published", nextTopics);
    },
  };
}

export function sortTopics(topics) {
  return [...topics].sort((a, b) => {
    const parent = String(a.parent).localeCompare(String(b.parent));
    if (parent !== 0) return parent;
    return String(a.title).localeCompare(String(b.title));
  });
}
