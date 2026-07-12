import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const N8N_WEBHOOK_URL = Deno.env.get("N8N_WEBHOOK_URL")!;
const N8N_WEBHOOK_SECRET = Deno.env.get("N8N_WEBHOOK_SECRET")!;

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

  let body: { email_log_id?: number; final_response?: string; refinement_prompts?: string[] };
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid json body" }, 400);
  }
  const { email_log_id, final_response, refinement_prompts } = body;
  if (!email_log_id || typeof final_response !== "string") {
    return json({ error: "email_log_id and final_response are required" }, 400);
  }

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  const { data: row, error: rowErr } = await admin
    .from("email_logs")
    .select("id, client_email, status, message_id")
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

  const { error: updateErr } = await admin
    .from("email_logs")
    .update({ final_response })
    .eq("id", email_log_id);
  if (updateErr) {
    return json({ error: updateErr.message }, 500);
  }

  const n8nResp = await fetch(N8N_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Webhook-Secret": N8N_WEBHOOK_SECRET,
    },
    body: JSON.stringify({ row_id: email_log_id, refinement_prompts: refinement_prompts ?? [] }),
  });

  if (!n8nResp.ok) {
    return json({ error: "n8n webhook failed", status: n8nResp.status }, 502);
  }

  return json({ ok: true });
});
