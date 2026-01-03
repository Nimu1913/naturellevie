# Fixing Cigarrgrossen on Custom Domain

If Cigarrgrossen works on `obsidian-peaks.pages.dev/cigarrgrossen/` but not on `obsidianpeaks.com/cigarrgrossen/`, follow these steps:

## Step 1: Verify Custom Domain Configuration

1. Go to Cloudflare Dashboard → **Pages** → Your project
2. Click **Custom domains**
3. Verify that `obsidianpeaks.com` is listed and shows as **Active**
4. If it's not active, click **Set up a custom domain** and add `obsidianpeaks.com`

## Step 2: Check DNS Settings

1. Go to Cloudflare Dashboard → **DNS** → **Records**
2. Verify there's a CNAME record:
   - **Name:** `@` (or `obsidianpeaks.com`)
   - **Target:** Your Pages project URL (e.g., `obsidian-peaks.pages.dev`)
   - **Proxy status:** Proxied (orange cloud)

## Step 3: Clear Cloudflare Cache

1. Go to Cloudflare Dashboard → **Caching** → **Configuration**
2. Click **Purge Everything** to clear all cached content
3. Wait 1-2 minutes, then try accessing `obsidianpeaks.com/cigarrgrossen/` again

## Step 4: Verify Build Output

1. Go to Cloudflare Dashboard → **Pages** → Your project → **Deployments**
2. Click on the latest deployment
3. Check the build logs to ensure:
   - Build completed successfully
   - Files are in `dist/cigarrgrossen/` directory
   - No errors in the build process

## Step 5: Check Pages Functions

1. Go to Cloudflare Dashboard → **Pages** → Your project → **Functions**
2. Verify that `functions/cigarrgrossen/[[path]].ts` is listed
3. Check the **Logs** tab to see if the function is being called on the custom domain

## Step 6: Test Direct Asset Access

Try accessing an asset directly:
- `obsidianpeaks.com/cigarrgrossen/assets/index-VkVke8O3.js`
- `obsidianpeaks.com/cigarrgrossen/index.html`

If these return 404 or HTML instead of the actual files, the static files aren't being served correctly.

## Step 7: Force Redeploy

1. Go to Cloudflare Dashboard → **Pages** → Your project → **Deployments**
2. Click the three dots (⋯) on the latest deployment
3. Click **Retry deployment**
4. Wait for the deployment to complete
5. Try accessing the site again

## Common Issues

**Empty HTML response:**
- The build might not be outputting files correctly
- Check that `dist/cigarrgrossen/index.html` exists in the build output
- Verify the build command includes `npm run build:cigarrgrossen`

**Assets return HTML:**
- The Pages Function might not be running on the custom domain
- Check Cloudflare Pages → Functions → Logs
- Verify the `_redirects` file is in `public/` and being deployed

**404 errors:**
- The custom domain might not be properly connected to the Pages deployment
- Re-add the custom domain in Cloudflare Pages settings


