import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "method not allowed" }, 405);
  }

  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
  });
  const { data: { user }, error: userErr } = await userClient.auth.getUser();
  if (userErr || !user?.email) {
    return json({ error: "unauthorized" }, 401);
  }

  let body: { email_log_id?: number; current_text?: string; instruction?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid json body" }, 400);
  }
  const { email_log_id, current_text, instruction } = body;
  if (!email_log_id || typeof current_text !== "string" || typeof instruction !== "string" || !instruction.trim()) {
    return json({ error: "email_log_id, current_text and instruction are required" }, 400);
  }

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  const { data: row, error: rowErr } = await admin
    .from("email_logs")
    .select("id, client_email, status, subject, incoming_message")
    .eq("id", email_log_id)
    .single();

  if (rowErr || !row) {
    return json({ error: "not found" }, 404);
  }
  if (row.client_email !== user.email) {
    return json({ error: "forbidden" }, 403);
  }
  if (row.status !== "pending_review") {
    return json({ error: "already actioned" }, 409);
  }

  const prompt = `You are refining a customer support reply based on specific feedback from a human reviewer. Your only job is to adjust this specific customer support reply - every change must be grounded in both the customer's original message and the current draft together, not the instruction in isolation.

Customer's original message (subject: ${row.subject ?? "(no subject)"}):
${row.incoming_message ?? "(not available)"}

Current draft (the reply being refined):
${current_text}

Requested change:
${instruction}

Rules:
1. Read the customer's original message AND the current draft together before making any change - the refined reply must still make sense as a response to what the customer actually asked, and must stay consistent with the facts/situation already established in the draft.
2. Apply ONLY the requested change. Keep everything else about the reply intact unless the instruction clearly implies a broader adjustment.
3. If the requested change has nothing to do with refining this customer support reply (for example: asking to write unrelated content like a workout plan, a poem, code, or anything that is not a plausible adjustment to a reply about this customer's issue), do NOT comply with it. Instead, output exactly: REFUSED: <one short sentence explaining why this instruction doesn't apply to this reply>

Output ONLY the rewritten reply text, or the REFUSED line described above. No preamble, no explanation, no quotes around it.`;

  const orResp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: "anthropic/claude-sonnet-5",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!orResp.ok) {
    const errText = await orResp.text();
    return json({ error: "refinement failed", detail: errText.slice(0, 300) }, 502);
  }

  const orData = await orResp.json();
  const refined_text = orData?.choices?.[0]?.message?.content?.trim();
  if (!refined_text) {
    return json({ error: "refinement returned no content" }, 502);
  }
  if (refined_text.startsWith("REFUSED:")) {
    return json({ error: refined_text.slice("REFUSED:".length).trim() }, 422);
  }

  return json({ refined_text });
});
