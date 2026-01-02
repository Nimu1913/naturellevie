# Resend Email Setup

The contact form now uses Resend for reliable email delivery.

## Setup Steps

### 1. Get Resend API Key

1. Go to [resend.com](https://resend.com) and sign up (free tier available)
2. Navigate to **API Keys** in the dashboard
3. Create a new API key
4. Copy the key (starts with `re_...`)

### 2. Add Environment Variable in Cloudflare Pages

1. Go to Cloudflare Dashboard → **Pages** → Your project
2. Click **Settings** → **Environment Variables**
3. Add a new variable:
   - **Variable name:** `RESEND_API_KEY`
   - **Value:** Your Resend API key (e.g., `re_abc123...`)
4. Make sure it's set for **Production** (and optionally Preview/Development)
5. Click **Save**

### 3. Verify Domain (Optional, for production)

For production, you should verify your domain in Resend:

1. In Resend dashboard → **Domains**
2. Add `obsidianpeaks.com`
3. Add the DNS records Resend provides to Cloudflare DNS
4. Update the `from` email in `functions/api/contact.ts` from `onboarding@resend.dev` to `noreply@obsidianpeaks.com` (or your verified domain)

### 4. Deploy

After setting the environment variable, trigger a new deployment:

- Either push a new commit, or
- Go to Cloudflare Pages → **Deployments** → **Retry deployment**

## Testing

1. Submit the contact form on your site
2. Check the browser console (Network tab) for any errors
3. Check Cloudflare Pages Functions logs for detailed error messages
4. If successful, you should receive an email at `info@obsidianpeaks.com`

## Troubleshooting

**500 Internal Server Error:**
- Check that `RESEND_API_KEY` is set in Cloudflare Pages environment variables
- Check Cloudflare Pages Functions logs for the exact error
- Verify the API key is correct in Resend dashboard

**Email not received:**
- Check Resend dashboard → **Emails** to see delivery status
- Verify `info@obsidianpeaks.com` is correct in `functions/api/contact.ts`
- Check spam folder

**Error details:**
- The function now returns detailed error messages in the response
- Check browser DevTools → Network → contact request → Response tab
- Check Cloudflare Pages → Functions → Logs

