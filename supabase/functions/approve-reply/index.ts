import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const N8N_WEBHOOK_URL = Deno.env.get("N8N_WEBHOOK_URL")!;
const N8N_WEBHOOK_SECRET = Deno.env.get("N8N_WEBHOOK_SECRET")!;

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method not allowed" }), { status: 405 });
  }

  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
  });
  const { data: { user }, error: userErr } = await userClient.auth.getUser();
  if (userErr || !user?.email) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });
  }

  let body: { email_log_id?: number; final_response?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid json body" }), { status: 400 });
  }
  const { email_log_id, final_response } = body;
  if (!email_log_id || typeof final_response !== "string") {
    return new Response(JSON.stringify({ error: "email_log_id and final_response are required" }), { status: 400 });
  }

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  const { data: row, error: rowErr } = await admin
    .from("email_logs")
    .select("id, client_email, status, message_id")
    .eq("id", email_log_id)
    .single();

  if (rowErr || !row) {
    return new Response(JSON.stringify({ error: "not found" }), { status: 404 });
  }
  if (row.client_email !== user.email) {
    return new Response(JSON.stringify({ error: "forbidden" }), { status: 403 });
  }
  if (row.status !== "pending_review") {
    return new Response(JSON.stringify({ error: "already actioned" }), { status: 409 });
  }

  const { error: updateErr } = await admin
    .from("email_logs")
    .update({ final_response })
    .eq("id", email_log_id);
  if (updateErr) {
    return new Response(JSON.stringify({ error: updateErr.message }), { status: 500 });
  }

  const n8nResp = await fetch(N8N_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Webhook-Secret": N8N_WEBHOOK_SECRET,
    },
    body: JSON.stringify({ row_id: email_log_id }),
  });

  if (!n8nResp.ok) {
    return new Response(JSON.stringify({ error: "n8n webhook failed", status: n8nResp.status }), { status: 502 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
