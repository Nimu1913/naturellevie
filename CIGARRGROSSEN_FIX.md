# Fixing Cigarrgrossen Build & Subpath Setup

## Step 1: Fix the Build

The build is failing. Check the build log in Cloudflare Pages to see the exact error. Common issues:

1. **Missing dependencies** - Make sure `package-lock.json` is committed
2. **TypeScript errors** - Fix any TS errors
3. **Build command** - Should be `npm run build`

## Step 2: Configure for Subpath `/cigarrgrossen`

Since Cigarrgrossen uses React Router, you need to configure it for the subpath.

### Update `vite.config.ts` in Cigarrgrossen repo:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  base: '/cigarrgrossen/', // Add this line
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### Update React Router in `src/App.tsx` (or wherever Router is):

```typescript
import { BrowserRouter } from 'react-router-dom';

// Change from:
<BrowserRouter>
  {/* routes */}
</BrowserRouter>

// To:
<BrowserRouter basename="/cigarrgrossen">
  {/* routes */}
</BrowserRouter>
```

## Step 3: Cloudflare Pages Settings

For Cigarrgrossen deployment:
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Root directory:** `/`

## Step 4: Update Proxy Function

After Cigarrgrossen is deployed, update `functions/cigarrgrossen/[[path]].ts` with the actual deployment URL.

## Alternative: Direct Subdirectory (Simpler)

If you want to avoid the proxy complexity, you can:

1. Add Cigarrgrossen as a subdirectory in the Obsidian Peaks repo
2. Update the build to output Cigarrgrossen to `dist/cigarrgrossen/`
3. Serve it directly without a proxy

This requires modifying the build process but is simpler for routing.


