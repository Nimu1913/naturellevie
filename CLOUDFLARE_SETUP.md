# Cloudflare Pages Email Setup

## Critical: Build Output Directory

**IMPORTANT:** Make sure Cloudflare Pages is configured to serve from the `dist` folder, not the root!

### Cloudflare Pages Settings:

1. **Build command:** `npm run build`
2. **Build output directory:** `dist` ⚠️ **MUST BE SET TO `dist`**
3. **Root directory:** (leave empty or set to `/`)

If the output directory is wrong, you'll see a white page because it's serving the source `index.html` (which references `/src/main.tsx`) instead of the built one (which references `/assets/index-*.js`).

## Using MailChannels (Free, No API Key Required)

This setup uses MailChannels, which is free and integrated with Cloudflare. No external services or API keys needed!

### Setup Steps

1. **Deploy to Cloudflare Pages**
   - Push your code to GitHub
   - In Cloudflare Dashboard → Pages → Create Project
   - Connect your repository
   - Build settings:
     - **Build command:** `npm run build`
     - **Build output directory:** `dist` ⚠️ **CRITICAL**
     - **Deploy command:** (leave empty)

2. **Add DNS Record (Required for MailChannels)**
   - In Cloudflare Dashboard → DNS → Records
   - Add a TXT record:
     - **Name:** `_mailchannels`
     - **Content:** `v=mc1;`
   - This authorizes MailChannels to send from your domain

3. **Update Email Addresses (Optional)**
   - Edit `functions/api/contact.ts`
   - Change `noreply@obsidianpeaks.com` to your domain
   - Change `info@obsidianpeaks.com` to your receiving email

### How It Works

- Form submissions go to `/api/contact`
- The function sends an email via MailChannels to `info@obsidianpeaks.com`
- The reply-to is set to the form submitter's email
- No API keys, no external services needed!

### Troubleshooting

**White page / MIME type errors:**
- Check that "Build output directory" is set to `dist` (not empty, not `/`, not `./dist`)
- Verify the built `dist/index.html` references `/assets/index-*.js`, not `/src/main.tsx`
- Clear browser cache and hard refresh (Cmd+Shift+R)

### Testing

After deployment, test the contact form. Emails will be sent directly to `info@obsidianpeaks.com` with the form details.
