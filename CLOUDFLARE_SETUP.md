# Cloudflare Pages Email Setup

## 1. Get Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Go to API Keys section
3. Create a new API key
4. Copy the key (starts with `re_`)

## 2. Add Domain to Resend (Optional but Recommended)

1. In Resend dashboard, go to Domains
2. Add `obsidianpeaks.com` (or your domain)
3. Verify DNS records in Cloudflare
4. Update the `from` email in `functions/api/contact.ts` to use your verified domain

## 3. Deploy to Cloudflare Pages

1. Push your code to GitHub/GitLab
2. In Cloudflare Dashboard → Pages → Create Project
3. Connect your repository
4. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Go to Settings → Environment Variables
6. Add: `RESEND_API_KEY` = `your_resend_api_key`

## 4. Test Locally (Optional)

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Run locally with environment variables
wrangler pages dev dist --compatibility-date=2024-01-01
```

## Alternative: Use Cloudflare Email Workers

If you prefer not to use Resend, you can use Cloudflare's Email Workers with MailChannels (free tier available).

