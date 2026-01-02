# Setting up Cigarrgrossen as a subpath

## Option 1: Separate Deployment + Proxy (Recommended)

### Step 1: Deploy Cigarrgrossen to Cloudflare Pages

1. In Cloudflare Dashboard → Pages → Create Project
2. Connect the `Cigarrgrossen` repository
3. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/`
4. Deploy and note the deployment URL (e.g., `cigarrgrossen.pages.dev`)

### Step 2: Update the Proxy Function

1. Edit `functions/cigarrgrossen/[[path]].ts`
2. Update the `cigarrgrossenUrl` variable with your Cigarrgrossen Pages URL:
   ```typescript
   const cigarrgrossenUrl = 'https://cigarrgrossen.pages.dev'; // Your actual URL
   ```

### Step 3: Deploy Obsidian Peaks

After updating the function, push to GitHub. The proxy will route `/cigarrgrossen/*` to your Cigarrgrossen deployment.

## Option 2: Monorepo (Alternative)

If you prefer to have both in one repo:

1. Add Cigarrgrossen as a subdirectory in the Obsidian Peaks repo
2. Update build process to build both projects
3. Serve Cigarrgrossen from `/cigarrgrossen` path

This is more complex but keeps everything in one place.

## Testing

After setup, visit:
- `obsidianpeaks.com` → Obsidian Peaks site
- `obsidianpeaks.com/cigarrgrossen` → Cigarrgrossen site

