import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const supabase = process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.VITE_SUPABASE_URL ? createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY) : null;
export default async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed" });
  if (!stripe) return response.status(400).json({ error: "STRIPE_SECRET_KEY is not configured." });
  const origin = request.headers.origin || process.env.VERCEL_URL || "http://localhost:5173";
  const items = Array.isArray(request.body?.items) ? request.body.items : [];
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment-failure`,
      line_items: items.map((item) => ({ quantity: item.qty || item.quantity || 1, price_data: { currency: "usd", unit_amount: Math.round(Number(item.price || 0) * 100), product_data: { name: item.name, images: item.image ? [item.image] : [] } } })),
      metadata: { source: "excedo" }
    });
    if (supabase) await supabase.from("payments").insert({ provider: "stripe", provider_reference: session.id, status: "created", amount: session.amount_total ? session.amount_total / 100 : 0, currency: "usd", raw_payload: session });
    response.status(200).json({ url: session.url });
  } catch (error) { response.status(500).json({ error: error.message }); }
}
