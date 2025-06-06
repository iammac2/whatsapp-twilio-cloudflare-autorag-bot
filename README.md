# Twilio AutoRAG WhatsApp Bot

A Cloudflare Worker that connects Twilio WhatsApp with Cloudflare AutoRAG to deliver intelligent, document-aware chatbot responses — all running serverlessly.

> Built and maintained by [neuno.ai](https://neuno.ai)

---

## 🚀 Features

- Twilio integration for WhatsApp
- Cloudflare Workers for ultra-low latency
- AutoRAG integration for contextual, file-backed responses
- Lightweight and scalable with no server setup
- Secrets managed securely via Wrangler

---

## 🛠️ Setup

Requires a Twilio "Try WhatsApp" Sandbox is set up under your Twilio account (can be uograded later to a paid Twilio number)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/twilio-autorag-bot.git
cd twilio-autorag-bot
```

### 2. Install Wrangler CLI (if not installed)

```bash
npm i -g wrangler
```

### 3. Add your secrets

```bash
wrangler secret put CF_API_TOKEN
wrangler secret put CF_ACCOUNT_ID
wrangler secret put AUTORAG_SLUG
wrangler secret put TWILIO_ACCOUNT_SID
wrangler secret put TWILIO_AUTH_TOKE
wrangler secret put TWILIO_PHONE_NUMBER
```

### 4. Deploy

```bash
wrangler deploy
```

### 5. Set up Twilio
After deploying the Cloudflare Worker, copy the deployed Worker URL (e.g., https://twilio-autorag-bot.yourdomain.workers.dev) and paste it into the "WHEN A MESSAGE COMES IN" field under:

1. Twilio Console → Messaging → Sandbox for WhatsApp → Sandbox Configuration
2. Scroll to the "Sandbox Configuration" section.
3. Paste your deployed URL into the "When a message comes in" field.
4. Ensure this field Method is set to "POST"
5 Save the changes.

This tells Twilio where to forward incoming WhatsApp messages.

### 6. Monitor

```bash
wrangler tail
```
