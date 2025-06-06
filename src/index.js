/**
 * Twilio WhatsApp AutoRAG Bot
 * 
 * This Cloudflare Worker connects Twilio's WhatsApp sandbox to a Cloudflare AutoRAG instance,
 * allowing users to ask questions via WhatsApp and receive contextual responses from a custom knowledge base.
 *
 * Project: https://neuno.ai
 * License: GPL-2.0
 * Author: I McGraw
 *
 * Environment Variables (set via Wrangler secret store):
 * - CF_ACCOUNT_ID
 * - CF_API_TOKEN
 * - AUTORAG_SLUG
 * - TWILIO_ACCOUNT_SID
 * - TWILIO_AUTH_TOKEN
 * - TWILIO_PHONE_NUMBER
 *
 * To deploy: `wrangler publish`
 * To monitor: `wrangler tail`
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  async fetch(request, env, ctx) {
    if (request.method !== 'POST') {
      return new Response('Only POST allowed', { status: 405 });
    }

    const body = await request.text();
    const form = new URLSearchParams(body);

    const incomingMessage = form.get('Body') || '';
    const senderNumber = form.get('From') || '';
    const userId = senderNumber.replace('whatsapp:', '');

    console.log(`Incoming message from ${userId}: ${incomingMessage}`);
    console.log(`Twilio Phone Number: ${env.TWILIO_PHONE_NUMBER}`);

    // Call AutoRAG
    const ragResponse = await fetch(`https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/autorag/rags/${env.AUTORAG_SLUG}/ai-search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.CF_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: incomingMessage })
    });

    let replyText = "Sorry, I couldn't get a response.";
    if (ragResponse.ok) {
      const data = await ragResponse.json();
      console.log("AutoRAG response:", JSON.stringify(data));
      replyText = data?.result?.response || replyText;
    } else {
      const errorText = await ragResponse.text();
      console.error("AutoRAG API error:", errorText);
    }

    // Send reply via Twilio
    const twilioResp = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        From: `whatsapp:${env.TWILIO_PHONE_NUMBER}`,
        To: senderNumber,
        Body: replyText
      })
    });

    return new Response(null, { status: 200 });
  }
};
