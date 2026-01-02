// Serve Cigarrgrossen files with correct MIME types
// This function MUST run before _redirects to ensure assets get correct MIME types
export async function onRequest({ request, next }: { request: Request; next: () => Promise<Response> }) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Only handle /cigarrgrossen paths
  if (!path.startsWith('/cigarrgrossen/')) {
    return next();
  }
  
  // Check if this is an asset file request
  const isAsset = /\.(js|mjs|css|json|wasm|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico|webp)$/i.test(path);
  
  // Get the response from Cloudflare Pages static file serving
  const response = await next();
  
  // Get content type
  const contentType = response.headers.get('content-type') || '';
  
  // If it's an asset request
  if (isAsset) {
    // If we got HTML, the file wasn't found (404 fallback from _redirects)
    if (contentType.includes('text/html')) {
      console.error(`[Cigarrgrossen] Asset ${path} returned HTML - file not found or redirect issue`);
      // Return 404 with plain text to avoid MIME type confusion
      return new Response(`404: Asset not found: ${path}`, { 
        status: 404,
        headers: { 
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Debug-Path': path,
        }
      });
    }
    
    // If we got the file successfully, FORCE correct MIME type
    if (response.status === 200) {
      const headers = new Headers(response.headers);
      
      // ALWAYS override Content-Type for assets to ensure correct MIME type
      if (path.endsWith('.css')) {
        headers.set('Content-Type', 'text/css; charset=utf-8');
      } else if (path.endsWith('.js') || path.endsWith('.mjs')) {
        headers.set('Content-Type', 'application/javascript; charset=utf-8');
      } else if (path.endsWith('.json')) {
        headers.set('Content-Type', 'application/json; charset=utf-8');
      } else if (path.endsWith('.wasm')) {
        headers.set('Content-Type', 'application/wasm');
      }
      
      // Ensure no HTML content type
      if (headers.get('Content-Type')?.includes('text/html')) {
        headers.set('Content-Type', 'application/javascript; charset=utf-8');
      }
      
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: headers,
      });
    }
  }
  
  // For HTML pages, return as-is
  return response;
}

